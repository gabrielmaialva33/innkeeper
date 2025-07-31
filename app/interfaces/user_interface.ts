import LucidRepositoryInterface from '#shared/lucid/lucid_repository_interface'
import { AccessToken } from '@adonisjs/auth/access_tokens'
import User from '#models/user'

namespace IUser {
  export interface Repository extends LucidRepositoryInterface<typeof User> {
    /**
     * Verify user credentials and return the user
     * @param uid
     * @param password
     */
    verifyCredentials(uid: string, password: string): Promise<User>

    /**
     * Generate an access token for the user with the given abilities
     * @param userId
     * @param abilities
     */
    generateAccessToken(userId: number, abilities?: string[]): Promise<AccessToken>

    /**
     * Generate a refresh token for the user with the given abilities
     * @param userId
     * @param abilities
     */
    generateRefreshToken(userId: number, abilities?: string[]): Promise<AccessToken>
  }

  export interface CreatePayload {
    full_name: string
    email: string
    username?: string
    password: string
  }

  export interface EditPayload {
    full_name?: string
    email?: string
    username?: string
    password?: string
  }
}

export default IUser
