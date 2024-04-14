const allowedOrigins = [
    "http://127.0.0.1:5500",
    "http://localhost:3500",
    "http://localhost:3000",
  ];
  
  const corsOptions = {
    origin: (origin, callback) => {
      callback(null, true);
    },
    optionsSuccessStatus: 200,
  };
  
  module.exports = corsOptions;