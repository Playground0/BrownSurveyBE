import { Express, Request, Response}  from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from '../../package.json';


const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "1.0.0",
        info: {
            title: 'BS-BE API Docs',
            version
        },
        components: {
            secritySchemas: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                },
            },
        },
        security: [
            {
                bearerAuth: []
            },
        ]
    },
    apis: ['./src/index.ts', './src/models/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number){
    //Swagger Page
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

    //Docs in JSON format
    app.get('docs.json', (req: Request, res: Response) => {
        res.setHeader('Content-type','application/json');
        res.send(swaggerSpec);
    })
};

export default swaggerDocs;