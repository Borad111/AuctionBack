import {z} from "zod";
import { parseZodError } from "../../utils/zod.error";

export const registerSchema = z.object({
  name: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
role: z.enum(["ADMIN", "BIDDER","SELLER"]).optional(),
});

export type registerInput = z.infer<typeof registerSchema>;

export function registerValidate(data:registerInput):{errorMsg?:string,success:boolean}{
    const result=registerSchema.safeParse(data);

    if(!result.success){
        const errormsg=parseZodError(result.error);
        return {errorMsg:errormsg,success:false};
    }

    return {success:true}
}