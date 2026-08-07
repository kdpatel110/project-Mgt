import { prisma } from '../configs/prisma.js'
import { randomUUID } from "crypto";
import { slugify } from 'inngest';
//get all workspace for user
export const getUserWorkspace = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const workspaces = await prisma.workspace.findMany({
            where: {
                members: { some: { userId } }
            },
            include: {
                members: { include: { user: true } },
                projects: {
                    include: {
                        tasks: { include: { assignee: true, comments: { include: { user: true } } } },
                        members: { include: { user: true } },
                    }
                },
                owner: true
            }
        });

        res.json({ workspaces })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

//Add member to workspace
export const addMember = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { email, role, workspaceId, message } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not Found" })
        }

        if (!workspaceId || !role) {
            return res.status(404).json({ message: "User not Found" })
        }

        if (!["ADMIN", 'MEMBER'].includes(role)) {
            return res.status(404).json({ message: "Invalid Role" })
        }

        // fetch workspace
        const workspace = await prisma.workspace.findUnique({
            where: { id: workspaceId },
            include: { members: true }
        })

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" })
        }

        I// Check creator has admin role
        if (!workspace.members.find((member) => member.userId === userId && member.
            role === "ADMIN")) {
            return res.status(401).json({
                message: "You do not have admin privileges"
            })
        }

        // Check if user is already a member
        const existingMember = workspace.members.find((member) => member.userId === userId);

        if (existingMember) {
            return res.status(400).json({
                message: "You do not have admin privileges"
            })
        }

        const member = await prisma.workspaceMember.create({
            data: {
                userId: user.id,
                workspaceId,
                role,
                message
            }
        })

        res.status(400).json({member, message: "User is already a member" })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message })
    }
}

export const createWorkspace = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Workspace name is required",
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const workspace = await prisma.workspace.create({
            data: {
                id: randomUUID(),
                name,
                slug: slugify(name, { lower: true }) + "-" + Date.now(),
                ownerId: user.id,

                members: {
                    create: {
                        userId: user.id,
                        role: "ADMIN",
                    },
                },
            },

            include: {
                members: true,
                owner: true,
            },
        });

        res.status(201).json({
            workspace,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: error.message,
        });
    }
};