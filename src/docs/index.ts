import config from '../config';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Skilledupload API Documentation',
    version: '0.0.1',
    description: 'Skilledupload API Documentation',
    license: {
      name: 'MIT',
      url: 'https://github.com/abdullahmia/abdullahmia.dev-api'
    }
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
      description: 'Development Server'
    }
  ]
};

export default swaggerDefinition;
