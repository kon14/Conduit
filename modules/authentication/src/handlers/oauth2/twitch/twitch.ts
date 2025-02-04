import ConduitGrpcSdk from '@conduitplatform/grpc-sdk';
import axios from 'axios';
import { TwitchUser } from './twitch.user';
import * as twitchParameters from './twitch.json';
import { OAuth2 } from '../OAuth2';
import { OAuth2Settings } from '../interfaces/OAuth2Settings';
import { ProviderConfig } from '../interfaces/ProviderConfig';
import { Payload } from '../interfaces/Payload';
import { ConnectionParams } from '../interfaces/ConnectionParams';

export class TwitchHandlers extends OAuth2<TwitchUser, OAuth2Settings> {
  constructor(grpcSdk: ConduitGrpcSdk, config: { twitch: ProviderConfig }) {
    super(grpcSdk, 'twitch', new OAuth2Settings(config.twitch, twitchParameters));
  }

  async connectWithProvider(details: ConnectionParams): Promise<Payload<TwitchUser>> {
    const twitch_access_token = details.accessToken;
    const expires_in = undefined;
    let profile_image_url;
    const response2 = await axios.get('https://api.twitch.tv/helix/users', {
      headers: {
        Authorization: `Bearer ${twitch_access_token}`,
        'Client-Id': this.settings.clientId,
      },
    });

    const id = response2.data.data[0].id;
    const email = response2.data.data[0].email;
    //profile_image_url = response2.data.data[0].profile_image_url;

    return {
      id: id,
      email: email,
      data: { ...response2.data.data[0] },
    };
  }
}
