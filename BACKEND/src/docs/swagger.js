const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'YT-GENAI Interview Prep API',
      version: '1.0.0',
      description: 'AI-powered interview preparation platform API'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token'
        }
      }
    }
  },
  apis: [
    './src/routes/*.js'
  ]
}

const specs = swaggerJsdoc(options)

module.exports = {
  specs,
  swaggerUi
}
