import { Request, Response, NextFunction } from 'express';
import fingerprint from 'express-fingerprint';

export const FingerprintMiddleware = (req: Request, res: Response, next: NextFunction) => {
    fingerprint({
        parameters: [
            // @ts-expect-error
            fingerprint.useragent,
            // @ts-expect-error
            fingerprint.acceptHeaders,
            // @ts-expect-error
            fingerprint.geoip,
        ],
    })(req, res, next);
};