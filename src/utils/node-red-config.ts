import axios from 'axios';

type NodeRedCredentialConfig = {
  username: string;
  password: string;
  permissions: string;
};

const logUserActivity = async (req, res, next) => {
  console.log({ updated: req });
  if (req.user) {
    console.log(
      `User ${req.user.username} made a request to ${req.originalUrl}`,
    );
    // a webhook or something
    await axios.post('http://localhost:3001/webhooks/node-red', { req, res });
    // Send this information to your backend
  }
  next();
};

export const getNodeRedConfig = (input: NodeRedCredentialConfig[]) => {
  return {
    flowFile: 'flows.json',
    flowFilePretty: true,
    uiPort: process.env.PORT || 1880,
    functionExternalModules: true,
    externalModules: { modules: [] },
    functionTimeout: 0,
    debugMaxLength: 1000,
    mqttReconnectTime: 15000,
    serialReconnectTime: 15000,
    exportGlobalContextKeys: false,
    runtimeState: {
      enabled: true,
      ui: true,
    },
    diagnostics: {
      enabled: true,
      ui: true,
    },
    logging: {
      console: {
        level: 'info',
        metrics: false,
        audit: false,
      },
    },
    httpAdminMiddleware: logUserActivity,
    adminAuth: { type: 'credentials', users: input },
  };
};
