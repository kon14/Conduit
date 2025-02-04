import { ConduitModule } from '../../classes/ConduitModule';
import { PushNotificationsDefinition } from '../../protoUtils/push-notifications';

export class PushNotifications extends ConduitModule<typeof PushNotificationsDefinition> {
  constructor(private readonly moduleName: string, url: string, grpcToken?: string) {
    super(moduleName, 'push-notifications', url, grpcToken);
    this.initializeClient(PushNotificationsDefinition);
  }

  sendNotificationToken(token: string, platform: string, userId: string) {
    return this.client!.setNotificationToken({
      token,
      platform,
      userId,
    }).then(res => {
      return JSON.parse(res.newTokenDocument);
    });
  }

  getNotificationTokens(userId: string) {
    return this.client!.getNotificationTokens({
      userId,
    }).then(res => {
      return res.tokenDocuments;
    });
  }

  sendNotification(
    sendTo: string,
    title: string,
    body?: string,
    data?: string,
    platform?: string,
  ) {
    return this.client!.sendNotification({
      sendTo,
      title,
      body,
      data,
      platform,
    }).then(res => {
      return JSON.parse(res.message);
    });
  }

  sendManyNotifications(
    notifications: [
      { sendTo: string; title: string; body?: string; data?: string; platform?: string },
    ],
  ) {
    return this.client!.sendManyNotifications({
      notifications,
    }).then(res => {
      return JSON.parse(res.message);
    });
  }

  sendNotificationToManyDevices(
    sendTo: string[],
    title: string,
    body?: string,
    data?: string,
    platform?: string,
  ) {
    return this.client!.sendNotificationToManyDevices({
      sendTo,
      title,
      body,
      data,
      platform,
    }).then(res => {
      return JSON.parse(res.message);
    });
  }
}
