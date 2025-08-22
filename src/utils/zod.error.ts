import { ZodError } from 'zod';
export function parseZodError(error:ZodError):string{
    const firstError=error.issues[0];
    const errormsg=firstError ? `${firstError.path.join('.')} - ${firstError.message}` :  "Invalid data";

    return errormsg;
}
