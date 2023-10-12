import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "./lib/prisma"
import dayjs from "dayjs"
import { Homework } from "@prisma/client"

export async function appRoutes(app: FastifyInstance) {
    // Create daily homeworks
    app.post("/homeworks", async (request) => {
        const createdHomeworkBody = z.object({
            title: z.string(),
        })

        const { title } = createdHomeworkBody.parse(request.body)

        const today = dayjs().startOf("day").toDate()

        await prisma.homework.create({
            data: {
                title,
                created_at: today,
                completed: false,
            }
        })
    })

    // Create weekly activities
    app.post("/weeklyactivities", async (request) => {
        const createdActivityBody = z.object({
            title: z.string(),
            description: z.string().optional(),
        });
        
        const { title, description } = createdActivityBody.parse(request.body)
        
        await prisma.weekActivity.create({
            data: {
                title,
                description,
            },
        })
    })

    // Create monthly events
    app.post("/monthlyevents", async (request) => {
        const createdEventBody = z.object({
            title: z.string(),
            discipline: z.string(),
            dueDate: z.string(),
            alertDate: z.string().optional(),
            description: z.string().optional(),
        });

        const { title, discipline, dueDate, alertDate, description } = createdEventBody.parse(request.body);

        const parsedDueData = dayjs(dueDate).startOf("day").toDate()
        const parsedAlertData = alertDate ? dayjs(alertDate).startOf("day").toDate() : null

        await prisma.event.create({
            data: {
                title,
                discipline,
                dueDate: parsedDueData,
                alertDate: parsedAlertData,
                description,
            },
        });
    });
      
    // Create disciplines
    app.post("/disciplines", async (request) => {
        const createdDisciplineBody = z.object({
            discipline: z.string(),
            field: z.string(),
        });
        
        const { discipline, field } = createdDisciplineBody.parse(request.body)
        
        await prisma.discipline.create({
            data: {
                discipline,
                field,
            },
        })
    })

    // Get all possible and completed tasks of the day
    app.get("/day", async (request) => {
        const getDayParams = z.object({
            date: z.coerce.date(),
        })

        const { date } = getDayParams.parse(request.query)

        const parsedData = dayjs(date).startOf('day').toDate()

        const possibleHomeworks = await prisma.homework.findMany({
           where: {
            created_at: {
                equals: parsedData,
            }
           },
           select: {
            id: true,
            title: true,
          },
        })

        const completedHomeworks = await prisma.homework.findMany({
            where: {
             created_at: {
                equals: parsedData,    
             }, 
             completed: true,
            },
            select: {
              id: true,
            },
         })

        return {
            possibleHomeworks,
            completedHomeworks
        }
    })

    // Get all events for the current month
    app.get("/events", async () => {
        const currentMonth = dayjs().month() + 1;

        const eventsMonth = await prisma.event.findMany({
            where: {
              dueDate: {
                gte: new Date(2023, currentMonth - 1, 1), // Start of the month
                lt: new Date(2023, currentMonth, 1), // Start of the next month
              },
            },
            select: {
                id: true,
                title: true,
                discipline: true,
                dueDate: true,
            },
        })

        return eventsMonth
    })

    // Trazer todas as atividades da semana
    app.get("/activities", async () => {
        const weekActivities = await prisma.weekActivity.findMany()

        return weekActivities
    })

    // Get all student's subjects
    app.get("/discipline", async () => {
        const disciplines = await prisma.discipline.findMany()

        return disciplines
    })

    // Completar / não completar a tarefa
    app.patch("/homeworks/:id/toggle", async (request) => {
        const toggleHomeworkParams = z.object({
            id: z.string().uuid(),
        })

        const { id } =toggleHomeworkParams.parse(request.params)

        let dayHomework = await prisma.homework.findFirst({
            where: {
                id: id
            }
        })

        if (dayHomework && !dayHomework.completed) {
            await prisma.homework.update({
                where: {
                    id: id,
                },
                data: {
                    completed: true,
                }
            })
        } else {
            await prisma.homework.update({
                where: {
                    id: id,
                },
                data: {
                    completed: false,
                }
            })
        }
    })

    // Traz todas as informações para o desempenho
    app.get("/summary", async () => {
        const homeworks = await prisma.homework.findMany({
            select: {
                id: true,
                created_at: true,
                completed: true
            }
        })

        const groupedByDay: { [index: number]: Partial<Homework>[] } = {};

        homeworks.forEach((homework) => {
            const monthDay = homework.created_at.getDate();
            if (!groupedByDay[monthDay]) groupedByDay[monthDay] = [];
            groupedByDay[monthDay].push(homework);
        });

        return groupedByDay;
    })
}