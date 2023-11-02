import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const firstHomeworkCreationDate = new Date('2022-10-01T03:00:00.000')
const secondHomeworkCreationDate = new Date('2023-10-03T03:00:00.000')
const thirdHomeworkCreationDate = new Date('2023-10-18T03:00:00.000')
const fourthHomeworkCreationDate = new Date('2023-10-06T03:00:00.000')
const fifthHomeworkCreationDate = new Date('2023-10-10T03:00:00.000')
const sixthHomeworkCreationDate = new Date('2023-10-15T03:00:00.000')
const seventhHomeworkCreationDate = new Date('2023-10-20T03:00:00.000')
const eighthHomeworkCreationDate = new Date('2023-10-23T03:00:00.000')

async function run() {
  await prisma.homework.deleteMany()
  await prisma.event.deleteMany()
  await prisma.weekActivity.deleteMany()
  await prisma.discipline.deleteMany()

  /**
   * Create Homeworks
   */
  await Promise.all([
    prisma.homework.create({
      data: {
        title: 'Estudar matemática',
        created_at: firstHomeworkCreationDate,
        completed: true,
      }
    }),

    prisma.homework.create({
      data: {
        title: 'Estudar química',
        created_at: firstHomeworkCreationDate,
        completed: false,
      }
    }),

    prisma.homework.create({
      data: {
        title: 'Estudar Biologia',
        created_at: secondHomeworkCreationDate,
        completed: true,
      }
    }),

    prisma.homework.create({
      data: {
        title: 'Pesquisa de Biologia',
        created_at: secondHomeworkCreationDate,
        completed: true,
      }
    }),

    prisma.homework.create({
      data: {
        title: 'Estudar Geografia',
        created_at: secondHomeworkCreationDate,
        completed: false,
      }
    }),


    prisma.homework.create({
      data: {
        title: 'Pesquisa de Geografia',
        created_at: thirdHomeworkCreationDate,
        completed: true,
      }
    }),

    prisma.homework.create({
      data: {
        title: 'Pesquisa de Matematica',
        created_at: fourthHomeworkCreationDate,
        completed: true,
      }
    }),

    prisma.homework.create({
      data: {
        title: 'Pesquisa de História',
        created_at: fourthHomeworkCreationDate,
        completed: false,
      }
    }),

    prisma.homework.create({
      data: {
        title: 'Tarefa de Geografia',
        created_at: fifthHomeworkCreationDate,
        completed: true,
      }
    }),

    prisma.homework.create({
      data: {
        title: 'Pesquisa de Sociologia',
        created_at: fifthHomeworkCreationDate,
        completed: true,
      }
    }),

    prisma.homework.create({
      data: {
        title: 'Pesquisa de Português',
        created_at: fifthHomeworkCreationDate,
        completed: true,
      }
    }),

    prisma.homework.create({
      data: {
        title: 'Pesquisa de Inglês',
        created_at: fifthHomeworkCreationDate,
        completed: false,
      }
    }),

    prisma.homework.create({
      data: {
        title: 'Tarfea de biologia',
        created_at: sixthHomeworkCreationDate,
        completed: true,
      }
    }),

    prisma.homework.create({
      data: {
        title: 'Pesquisa de Geografia',
        created_at: seventhHomeworkCreationDate,
        completed: true,
      }
    }),

    prisma.homework.create({
      data: {
        title: 'Pesquisa de Biologia',
        created_at: seventhHomeworkCreationDate,
        completed: false,
      }
    }),

    prisma.homework.create({
      data: {
        title: 'Pesquisa de Geografia',
        created_at: eighthHomeworkCreationDate,
        completed: true,
      }
    }),

  ])
  
  /**
   * Create Event
   */
  await Promise.all([
    prisma.event.create({
      data: {
        title: 'Prova',
        discipline: 'matemática',
        dueDate: firstHomeworkCreationDate,
        description: 'Prova de matemática vai cair algebra',
      }
    }),

    prisma.event.create({
      data: {
        title: 'Seminario',
        discipline: 'geografia',
        dueDate: secondHomeworkCreationDate,
        alertDate: secondHomeworkCreationDate,
        description: 'Seminário de geografia - tema: relevo',
      }
    }),

    prisma.event.create({
      data: {
        title: 'Trabalho',
        discipline: 'história',
        dueDate: thirdHomeworkCreationDate,
        alertDate: thirdHomeworkCreationDate,
      }
    }),
  ])

  /**
   * Create Week Activity
   */
    await Promise.all([
      prisma.weekActivity.create({
        data: {
          title: 'Estudar matemática',
          description: 'Prova de matemática vai cair algebra',
        }
      }),

      prisma.weekActivity.create({
        data: {
          title: 'Pesquisa de geografia',
          description: 'Sobre relevo',
        }
      }),

      prisma.weekActivity.create({
        data: {
          title: 'Estudar história',
        }
      }),
    ])

    /**
   * Create Discipline
   */
      await Promise.all([
        prisma.discipline.create({
          data: {
            discipline: 'matemática',
            field: 'Matematica',
          }
        }),
  
        prisma.discipline.create({
          data: {
            discipline: 'história',
            field: 'Humanas',
          }
        }),
  
        prisma.discipline.create({
          data: {
            discipline: 'biologia',
            field: 'Naturezas',
          }
        }),
      ])
}

run()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })