const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { rateLimit } = require("express-rate-limit");
const db = require("./database");

const router = express.Router();
const cookieName = "gbn_token";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 2 * 60 * 60 * 1000
};

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false
});

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false
});

function safeUser(user) {
    const business = db.prepare(`
        SELECT business_name, country, business_type, description, contact_email
        FROM business_profiles
        WHERE user_id = ?
    `).get(user.id);

    return {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        createdAt: user.created_at,
        business: business ? {
            businessName: business.business_name,
            country: business.country,
            businessType: business.business_type,
            description: business.description,
            contactEmail: business.contact_email
        } : null
    };
}

function createToken(user) {
    return jwt.sign(
        { sub: String(user.id), role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
    );
}

router.post("/register", registerLimiter, async (req, res) => {
    try {
        const {
            fullName,
            businessName,
            email,
            country,
            password,
            role,
            businessType
        } = req.body || {};

        if (
            typeof fullName !== "string" ||
            typeof businessName !== "string" ||
            typeof email !== "string" ||
            typeof country !== "string" ||
            typeof password !== "string" ||
            typeof role !== "string" ||
            typeof businessType !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Please complete all required fields."
            });
        }

        const cleanName = fullName.trim();
        const cleanBusiness = businessName.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanCountry = country.trim();

        if (cleanName.length < 2 || cleanName.length > 100 ||
            cleanBusiness.length < 2 || cleanBusiness.length > 150 ||
            cleanCountry.length < 2 || cleanCountry.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Please check your name, business name and country."
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        if (password.length < 8 || password.length > 72) {
            return res.status(400).json({
                success: false,
                message: "Password must be 8 to 72 characters."
            });
        }

        if (!["buyer", "supplier", "both"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid account type."
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const createAccount = db.transaction(() => {
            const result = db.prepare(`
                INSERT INTO users (full_name, email, password_hash, role)
                VALUES (?, ?, ?, ?)
            `).run(cleanName, cleanEmail, passwordHash, role);

            const userId = result.lastInsertRowid;

            db.prepare(`
                INSERT INTO business_profiles
                (user_id, business_name, country, business_type, contact_email)
                VALUES (?, ?, ?, ?, ?)
            `).run(userId, cleanBusiness, cleanCountry, businessType, cleanEmail);

            return db.prepare(`
                SELECT id, full_name, email, role, created_at
                FROM users WHERE id = ?
            `).get(userId);
        });

        const user = createAccount();
        const token = createToken(user);

        res.cookie(cookieName, token, cookieOptions);

        return res.status(201).json({
            success: true,
            message: "Account created successfully.",
            user: safeUser(user)
        });

    } catch (error) {
        if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        console.error("Registration error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Registration failed. Please try again."
        });
    }
});

router.post("/login", loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (typeof email !== "string" ||
            typeof password !== "string") {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const user = db.prepare(`
            SELECT id, full_name, email, password_hash, role, created_at
            FROM users WHERE email = ? COLLATE NOCASE
        `).get(email.trim());

        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        res.cookie(cookieName, createToken(user), cookieOptions);

        return res.json({
            success: true,
            message: "Login successful.",
            user: safeUser(user)
        });

    } catch (error) {
        console.error("Login error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Login failed. Please try again."
        });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie(cookieName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/"
    });

    res.json({
        success: true,
        message: "Logged out successfully."
    });
});

router.get("/me", (req, res) => {
    try {
        const token = req.cookies && req.cookies[cookieName];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please log in."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = db.prepare(`
            SELECT id, full_name, email, role, created_at
            FROM users WHERE id = ?
        `).get(Number(decoded.sub));

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Account not found."
            });
        }

        return res.json({
            success: true,
            user: safeUser(user)
        });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Session expired. Please log in again."
        });
    }
});


router.get("/dashboard-stats", (req, res) => {
    try {
        const token = req.cookies && req.cookies[cookieName];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please log in."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = db.prepare(
            "SELECT id FROM users WHERE id = ?"
        ).get(Number(decoded.sub));

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Account not found."
            });
        }

        const result = db.prepare(
            "SELECT COUNT(*) AS total FROM users"
        ).get();

        return res.json({
            success: true,
            totalBusinessMembers: result.total
        });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Session expired. Please log in again."
        });
    }
});

router.get("/dashboard-members-breakdown", (req, res) => {
    try {
        const token = req.cookies && req.cookies[cookieName];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please log in."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = db.prepare(
            "SELECT id FROM users WHERE id = ?"
        ).get(Number(decoded.sub));

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Account not found."
            });
        }

        const buyers = db.prepare(
            "SELECT COUNT(*) AS total FROM users WHERE role IN ('buyer', 'both')"
        ).get();

        const suppliers = db.prepare(
            "SELECT COUNT(*) AS total FROM users WHERE role IN ('supplier', 'both')"
        ).get();

        return res.json({
            success: true,
            totalBuyers: buyers.total,
            totalSuppliers: suppliers.total
        });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Session expired. Please log in again."
        });
    }
});

// ===== GBN BUSINESS OPPORTUNITIES API =====

function getOpportunityUser(req) {
    try {
        const token = req.cookies && req.cookies[cookieName];
        if (!token) return null;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return db.prepare(`
            SELECT id, role, is_admin
            FROM users
            WHERE id = ?
        `).get(Number(decoded.sub)) || null;

    } catch (error) {
        return null;
    }
}

function validOpportunityInput(body) {
    if (!body || typeof body !== "object") return false;

    return (
        typeof body.title === "string" &&
        body.title.trim().length >= 5 &&
        body.title.trim().length <= 160 &&
        typeof body.category === "string" &&
        body.category.trim().length >= 2 &&
        body.category.trim().length <= 80 &&
        typeof body.country === "string" &&
        body.country.trim().length >= 2 &&
        body.country.trim().length <= 100 &&
        typeof body.description === "string" &&
        body.description.trim().length >= 20 &&
        body.description.trim().length <= 3000
    );
}

// Dashboard: active opportunity count
router.get("/dashboard-opportunities", (req, res) => {
    const user = getOpportunityUser(req);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Please log in."
        });
    }

    try {
        const result = db.prepare(`
            SELECT COUNT(*) AS total
            FROM business_opportunities
            WHERE status = 'active'
        `).get();

        return res.json({
            success: true,
            totalActiveOpportunities: result.total
        });

    } catch (error) {
        console.error("Opportunity dashboard error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Could not load opportunities."
        });
    }
});

// View active opportunities
router.get("/opportunities", (req, res) => {
    const user = getOpportunityUser(req);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Please log in."
        });
    }

    try {
        const opportunities = db.prepare(`
            SELECT
                o.id, o.title, o.category, o.country,
                o.description, o.status, o.created_at,
                u.full_name AS creator_name,
                b.business_name
            FROM business_opportunities o
            JOIN users u ON u.id = o.created_by
            LEFT JOIN business_profiles b ON b.user_id = u.id
            WHERE o.status = 'active'
            ORDER BY o.created_at DESC
        `).all();

        return res.json({
            success: true,
            opportunities
        });

    } catch (error) {
        console.error("Opportunity listing error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Could not load opportunities."
        });
    }
});

// View own opportunities
router.get("/opportunities/mine", (req, res) => {
    const user = getOpportunityUser(req);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Please log in."
        });
    }

    const opportunities = db.prepare(`
        SELECT *
        FROM business_opportunities
        WHERE created_by = ?
        ORDER BY created_at DESC
    `).all(user.id);

    return res.json({ success: true, opportunities });
});

// Admin: view all opportunities
router.get("/opportunities/manage", (req, res) => {
    const user = getOpportunityUser(req);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Please log in."
        });
    }

    if (user.is_admin !== 1) {
        return res.status(403).json({
            success: false,
            message: "Admin permission required."
        });
    }

    const opportunities = db.prepare(`
        SELECT *
        FROM business_opportunities
        ORDER BY created_at DESC
    `).all();

    return res.json({ success: true, opportunities });
});

// Members and Admin: publish opportunity
router.post("/opportunities", (req, res) => {
    const user = getOpportunityUser(req);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Please log in."
        });
    }

    if (!validOpportunityInput(req.body)) {
        return res.status(400).json({
            success: false,
            message: "Please provide valid opportunity details."
        });
    }

    try {
        const duplicate = db.prepare(`
            SELECT id
            FROM business_opportunities
            WHERE created_by = ?
              AND status = 'active'
              AND lower(trim(title)) = lower(trim(?))
              AND lower(trim(category)) = lower(trim(?))
              AND lower(trim(country)) = lower(trim(?))
              AND lower(trim(description)) = lower(trim(?))
            LIMIT 1
        `).get(
            user.id,
            req.body.title.trim(),
            req.body.category.trim(),
            req.body.country.trim(),
            req.body.description.trim()
        );

        if (duplicate) {
            return res.status(409).json({
                success: false,
                message: "This opportunity is already published. Please check My Opportunities."
            });
        }

        const result = db.prepare(`
            INSERT INTO business_opportunities
            (created_by, title, category, country, description)
            VALUES (?, ?, ?, ?, ?)
        `).run(
            user.id,
            req.body.title.trim(),
            req.body.category.trim(),
            req.body.country.trim(),
            req.body.description.trim()
        );

        return res.status(201).json({
            success: true,
            message: "Business opportunity published.",
            opportunityId: Number(result.lastInsertRowid)
        });

    } catch (error) {
        console.error("Opportunity publishing error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Could not publish opportunity."
        });
    }
});

// Owner or Admin: edit opportunity
router.patch("/opportunities/:id", (req, res) => {
    const user = getOpportunityUser(req);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Please log in."
        });
    }

    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id < 1) {
        return res.status(400).json({
            success: false,
            message: "Invalid opportunity ID."
        });
    }

    if (!validOpportunityInput(req.body) ||
        !["active", "closed"].includes(req.body.status)) {
        return res.status(400).json({
            success: false,
            message: "Invalid opportunity details or status."
        });
    }

    const existing = db.prepare(`
        SELECT id, created_by
        FROM business_opportunities
        WHERE id = ?
    `).get(id);

    if (!existing) {
        return res.status(404).json({
            success: false,
            message: "Opportunity not found."
        });
    }

    if (existing.created_by !== user.id && user.is_admin !== 1) {
        return res.status(403).json({
            success: false,
            message: "You cannot edit this opportunity."
        });
    }

    db.prepare(`
        UPDATE business_opportunities
        SET title = ?, category = ?, country = ?,
            description = ?, status = ?
        WHERE id = ?
    `).run(
        req.body.title.trim(),
        req.body.category.trim(),
        req.body.country.trim(),
        req.body.description.trim(),
        req.body.status,
        id
    );

    return res.json({
        success: true,
        message: "Opportunity updated."
    });
});

// Owner or Admin: close opportunity
router.delete("/opportunities/:id", (req, res) => {
    const user = getOpportunityUser(req);

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Please log in."
        });
    }

    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id < 1) {
        return res.status(400).json({
            success: false,
            message: "Invalid opportunity ID."
        });
    }

    const existing = db.prepare(`
        SELECT id, created_by
        FROM business_opportunities
        WHERE id = ?
    `).get(id);

    if (!existing) {
        return res.status(404).json({
            success: false,
            message: "Opportunity not found."
        });
    }

    if (existing.created_by !== user.id && user.is_admin !== 1) {
        return res.status(403).json({
            success: false,
            message: "You cannot close this opportunity."
        });
    }

    db.prepare(`
        UPDATE business_opportunities
        SET status = 'closed'
        WHERE id = ?
    `).run(id);

    return res.json({
        success: true,
        message: "Opportunity closed."
    });
});

module.exports = router;


