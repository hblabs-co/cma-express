import pino from 'pino'

class APILoggerClass {
    logger = pino({
        transport: {
            target: 'pino-pretty'
        }
    });

    info(message) {
        this.logger.info(message)
    }

    info(message, data) {
        this.logger.info(`${message}   ${undefined != data ? JSON.stringify(data) : ''}`);
    }

    error(message) {
        this.logger.error(message);
    }
}

export const APILogger = new APILoggerClass();