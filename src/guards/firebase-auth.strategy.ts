import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import * as firebaseConfig from '../config/firebase.json';
import * as firebase from 'firebase-admin';
import { UserService } from '../user/user.service';

const firebase_params = {
  type: firebaseConfig.type,
  projectId: firebaseConfig.project_id,
  privateKeyId: firebaseConfig.private_key_id,
  privateKey: firebaseConfig.private_key,
  clientEmail: firebaseConfig.client_email,
  clientId: firebaseConfig.client_id,
  authUri: firebaseConfig.auth_uri,
  tokenUri: firebaseConfig.token_uri,
  authProviderX509CertUrl: firebaseConfig.auth_provider_x509_cert_url,
  clientC509CertUrl: firebaseConfig.client_x509_cert_url,
};

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(
  Strategy,
  'firebase-auth',
) {
  private defaultApp: any;
  constructor(
    private readonly userService: UserService
  ) {
    // Calls the constructor of the parent class passing an object with jwtFromRequest property set to ExtractJwt.fromAuthHeaderAsBearerToken().
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });

    // Initializes the defaultApp property with a Firebase app initialized using the provided firebase_params.
    this.defaultApp = firebase.initializeApp({
      credential: firebase.credential.cert(firebase_params),
    });

  }
  // Defines an asynchronous method named validate which takes a parameter token of type string.
  async validate(token: string) {
    // Asynchronously verifies the provided token using the defaultApp's authentication module and stores the result in firebaseUser.
    const firebaseUser: any = await this.defaultApp
      .auth()
      .verifyIdToken(token, true)
      .catch((err) => {
        // If an error occurs during token verification, it is logged and an UnauthorizedException is thrown with the error message.
        console.log(err);
        throw new UnauthorizedException(err.message);
      });

    // If firebaseUser is falsy, indicating unsuccessful verification, an UnauthorizedException is thrown.
    if (!firebaseUser) {
      throw new UnauthorizedException();
    }

    // Retrieves user information from the userService based on the email obtained from the firebaseUser.
    const user = await this.userService.getUser(firebaseUser.email);

    // Returns an object containing user information along with roles extracted from the user's roles using map function.
    return {
      ...user,
      roles: user.roles.map((role) => role.role),
    }
  }

}