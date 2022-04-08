const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "내 API",
    description: "학선이가 테스트하고 있다.",
    tags: [
        {
            "name": "User",
        }
    ]
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = [
  "./app.js"
];

swaggerAutogen(outputFile, endpointsFiles, doc);