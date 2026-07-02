import winston from 'winston';

const transports = [
    new winston.transports.Console({
        format: process.env.NODE_ENV === 'production'
            ? winston.format.json()
            : winston.format.combine(
                  winston.format.colorize(),
                  winston.format.simple()
              ),
    }),
];

// Only write log files during local development
if (process.env.NODE_ENV !== 'production') {
    transports.push(
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
        }),
        new winston.transports.File({
            filename: 'logs/combined.log',
        })
    );
}

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: {
        service: 'school-management',
    },
    transports,
});

export default logger;