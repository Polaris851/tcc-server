import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "./lib/prisma"
import dayjs from "dayjs"

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
            weekActivityTimes: z.array(z.object({
                dayOfWeek: z.enum(["Segunda", "Terca", "Quarta", "Quinta", "Sexta"]),
                startTime: z.string(),
                endTime: z.string()
            }))
        });
        
        const { title, description, weekActivityTimes } = createdActivityBody.parse(request.body)
        
        const weekActivitiyEntity = await prisma.weekActivity.create({
            data: {
                title,
                description,
            },
        })

        if (weekActivitiyEntity && "id" in weekActivitiyEntity) {
            const formattedWeekActivityTimes = weekActivityTimes.map((weekActivityTime) => ({
                ...weekActivityTime,
                startTime: hoursAndMinutesToDate(weekActivityTime.startTime),
                endTime: hoursAndMinutesToDate(weekActivityTime.endTime),
                week_activity_id: weekActivitiyEntity.id
            }))
            
            await prisma.timeWeekActivity.createMany({
                data: formattedWeekActivityTimes
            })
        }
    })

    // Create monthly events
    app.post("/monthlyevents", async (request) => {
        const createdEventBody = z.object({
            title: z.enum(["Prova", "Seminario", "Trabalho", "Tarefa"]),
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
      
    const hoursAndMinutesToDate = (time: string) => {
        const [hours, minutes] = time.split(":")
        
        const timestamp = new Date()
        if (hours && minutes) {
            timestamp.setHours(parseInt(hours))
            timestamp.setMinutes(parseInt(minutes))
        }

        return timestamp
    }

    // Create disciplines
    app.post("/disciplines", async (request) => {
        const createdDisciplineBody = z.object({
            discipline: z.string(),
            field: z.enum(["Matematica", "Naturezas", "Humanas", "Linguagens", "Tecnico"]),
            disciplineTimes: z.array(z.object({
                dayOfWeek: z.enum(["Segunda", "Terca", "Quarta", "Quinta", "Sexta"]),
                startTime: z.string(),
                endTime: z.string()
            }))
        });

        const { discipline, field, disciplineTimes } = createdDisciplineBody.parse(request.body)

        const disciplineEntity = await prisma.discipline.create({
            data: {
                discipline,
                field,
            },
        })
        
        if (disciplineEntity && "id" in disciplineEntity) {
            const formattedDisciplineTimes = disciplineTimes.map((disciplineTime) => ({
                ...disciplineTime,
                startTime: hoursAndMinutesToDate(disciplineTime.startTime),
                endTime: hoursAndMinutesToDate(disciplineTime.endTime),
                discipline_id: disciplineEntity.id
            }))
            
            await prisma.timeDiscipline.createMany({
                data: formattedDisciplineTimes
            })
        }

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

    app.get("/summary", async () => {
        const homeworks = await prisma.homework.findMany({
            select: {
                id: true,
                created_at: true,
                completed: true
            }
        })

        const groupedByDay: { [index: string]: { date: string; completed: number; amount: number } } = {}

        homeworks.forEach((homework: any) => {
          const dayKey = homework.created_at.toISOString().split('T')[0]
          
          if (!groupedByDay[dayKey]) {
            groupedByDay[dayKey] = {
              date: dayKey,
              completed: 0,
              amount: 0
            }
          }
        
          if (homework.completed) {
            groupedByDay[dayKey].completed++
          }
          groupedByDay[dayKey].amount++
        });
        
        return Object.values(groupedByDay)
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
            orderBy: {
                dueDate: 'asc', 
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

    app.get("/week", async () => {
        const weekActivities = await prisma.weekActivity.findMany({
            select: {
                id: true,
                title: true,
            }
        })

        const weekActivityIds = weekActivities.map((activity) => activity.id)

        const weekActivitiesTimes = await prisma.timeWeekActivity.findMany({
            where: {
                week_activity_id: {
                    in: weekActivityIds, 
                },
            },
            select: {
                dayOfWeek: true,
                startTime: true,
                endTime: true,
                week_activity_id: true,
            },
        })

        const weekActivity = weekActivities.map((activity) => {
            const matchingTimes = weekActivitiesTimes.filter((time) => time.week_activity_id === activity.id);
            return {
              id: activity.id,
              title: activity.title,
              times: matchingTimes.map((time) => ({
                dayOfWeek: time.dayOfWeek,
                startTime: time.startTime,
                endTime: time.endTime,
              })),
            };
          });

        const disciplines = await prisma.discipline.findMany({
            select: {
                id: true,
                discipline: true,
            },
            distinct: ['discipline']
        })

        const disciplinesIds = disciplines.map((discipline) => discipline.id)

        const disciplinesTimes = await prisma.timeDiscipline.findMany({
            where: {
                discipline_id: {
                    in: disciplinesIds, 
                },
            },
            select: {
              dayOfWeek: true,
              startTime: true,
              endTime: true,
              discipline_id: true,
            },
        })

        const discipline = disciplines.map((discipline) => {
            const matchingTimes = disciplinesTimes.filter((time) => time.discipline_id === discipline.id);
            return {
              id: discipline.id,
              discipline: discipline.discipline,
              times: matchingTimes.map((time) => ({
                dayOfWeek: time.dayOfWeek,
                startTime: time.startTime,
                endTime: time.endTime,
              })),
            };
          });

        
        return { weekActivity, discipline}

    })

    // Get all student's subjects
    app.get("/discipline", async () => {
        const disciplines = await prisma.discipline.findMany({
            select: {
                id: true,
                discipline: true,
                field: true,
            },
            distinct: ['discipline']
        })

        return  disciplines
    })

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

    app.delete("/homeworks/:id", async (request) => {
        const deleteHomeworkParams = z.object({
            id: z.string().uuid(),
        })

        const { id } = deleteHomeworkParams.parse(request.params)

        await prisma.homework.delete({
            where: {
                id: id
            }
        })
    })

    app.delete("/monthlyevents/:id", async (request) => {
        const deleteMonthlyEventsParams = z.object({
            id: z.string().uuid(),
        })
        
        const { id } = deleteMonthlyEventsParams.parse(request.params)

        await prisma.event.delete({
            where: {
                id: id
            }
        })
    })
    
    app.delete("/weeklyactivities/:id", async (request) => {
        const deleteWeeklyActivitiesParams = z.object({
            id: z.string().uuid(),
        })

        const { id } = deleteWeeklyActivitiesParams.parse(request.params)

        await prisma.timeWeekActivity.deleteMany({
            where: {
                week_activity_id: id,
            }
        })

        await prisma.weekActivity.delete({
            where: {
                id: id
            }
        })
    })

    app.delete("/disciplines/:id", async (request) => {
        const deleteDisciplinesParams = z.object({
            id: z.string().uuid(),
        })

        const { id } = deleteDisciplinesParams.parse(request.params)

        await prisma.timeDiscipline.deleteMany({
            where: {
                discipline_id: id,
            }
        })

        await prisma.discipline.delete({
            where: {
                id: id
            }
        })
    })
}