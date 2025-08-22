import bcrypt from "bcryptjs";

export const hashPassword = async (password: string): Promise<string> => {
    try {
        const saltRounds = 12; // You can adjust the salt rounds as needed
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw new Error("Error hashing password: ");
    }
    }

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    try {
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;
    } catch (error) {
        throw new Error("Error comparing password: ");
    }
}