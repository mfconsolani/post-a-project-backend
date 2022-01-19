import bcrypt from 'bcrypt'

const hashedPassword = () => {

}

export const passwordHasher = async (password:string) => {
    try {
        return await bcrypt.hash(password, process.env.SALT_ROUNDS)
    } catch (err) {
        return err
    }
}


export const isValidPassword = async (password: string, hash: string) => {
    try {
        return await bcrypt.compare(password, hash)
    } catch (err) {
        return err
    }
}