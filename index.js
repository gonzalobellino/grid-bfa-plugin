const path = require('path');
const fs = require('fs-extra')

let  platform = 'windows'
let  networkEnv = 'testnet'
let  bfaDir = 'BFA' + path.sep + networkEnv
let  dataDir = `${process.env.APPDATA}/` + bfaDir

let bootnodes =  "enode://7ec4dd9d5e1a2b29d6b60aa9f95677c0c3a5f9306e73d65dd3bcbfda3737a8c509b02d1eab763ce39f18cfe96423df7ee544d6c36191ec17f59ade75bc99d358@[2800:110:44:6300::aad2:2db3]:30301," +
                 "enode://7ec4dd9d5e1a2b29d6b60aa9f95677c0c3a5f9306e73d65dd3bcbfda3737a8c509b02d1eab763ce39f18cfe96423df7ee544d6c36191ec17f59ade75bc99d358@170.210.45.179:30301," +
                 "enode://82b66b13d7addcf9ffe1e4e972a105f6ccf50557161c4a0978a5d9ce595ababde609ea8a49897ae89b1d41e90551cb2e9241363238593e950ca68bd5af7c24d6@200.16.28.28:30301," +
                 "enode://59ae768ecdee632e0daceccb6f71b215392eba89230d626573f2fb4e9c0786c9a661027ab7343820ca63d96fe48ffd81ed1bf6e4d512f0ba50ec072c9efd9e4e@200.108.146.100:30301"

// Platform specific initialization
switch (process.platform) {
  case 'win32': {
    platform = 'windows'
    dataDir = `${process.env.APPDATA}\\` + bfaDir
    break
  }
  case 'linux': {
    platform = 'linux'
    dataDir = '~/.' + bfaDir
    break
  }
  case 'darwin': {
    platform = 'darwin'
    dataDir = '~/Library/' + bfaDir
    break
  }
  default: {
  }
}

console.log("copy database to " + dataDir)
fs.mkdirSync(dataDir, {recursive:true})
fs.copySync(path.join(__dirname, 'geth'),path.join(dataDir, 'geth'),
  {overwrite : false})

const keystoreDir =
  process.platform === 'win32' ? `${dataDir}\\keystore` : `${dataDir}/keystore`

const findIpcPathInLogs = logs => {
  let ipcPath
  for (const logPart of logs) {
    const found = logPart.includes('IPC endpoint opened')
    if (found) {
      ipcPath = logPart.split('=')[1].trim()
      // fix double escaping
      if (ipcPath.includes('\\\\')) {
        ipcPath = ipcPath.replace(/\\\\/g, '\\')
      }
      console.log('Found IPC path: ', ipcPath)
      return ipcPath
    }
  }
  console.log('IPC path not found in logs', logs)
  return null
}

module.exports = {
  type: 'client',
  order: 1,
  displayName: 'BFA Testnet',
  name: 'BFA.testnet',
  repository: 'https://gethstore.blob.core.windows.net',
  modifiers: {
    version: ({ version }) =>
      version
        .split('-')
        .slice(0, -1)
        .join('-')
  },
  filter: {
    name: {
      includes: [platform],
      excludes: ['unstable', 'alltools', 'swarm', 'mips', 'arm']
    }
  },
  prefix: `geth-${platform}`,
  binaryName: process.platform === 'win32' ? 'geth.exe' : 'geth',
  resolveIpc: logs => findIpcPathInLogs(logs),
  settings: [
    {
      id: bootnodes,
      default: bootnodes,
      label: 'bootnodes',
      flag: '--bootnodes %s'
    },
    {
      id: 'networkId',
      default: '55555000000',
      label: 'Network Id',
      flag: '--networkid %s'
    },
    {
      id: 'dataDir',
      default: dataDir,
      label: 'Data Directory',
      flag: '--datadir %s'
    },
    {
      id: 'syncMode',
      default: 'fast',
      label: 'Sync Mode',
      options: [
        { value: 'fast', label: 'Fast' },
        { value: 'full', label: 'Full' },
        { value: 'light', label: 'Light' }
      ],
      flag: '--syncmode %s'
    },
    {
      id: 'dataDir',
      default: dataDir,
      label: 'Data Directory',
      options: [
        { value: dataDir, label: dataDir }
      ],
       flag: '--datadir %s'
    },
    {
      id: 'keystoreDir',
      default: keystoreDir,
      label: 'Keystore Directory',
      options: [
        { value: keystoreDir, label: keystoreDir }
      ],
      flag: '--keystore %s',
    },
    {
      id: 'console',
      label: 'Enable Console',
      default: 'false',
      options: [
        { value: 'true', flag: 'console', label: 'Yes' },
        { value: 'false', flag: '', label: 'No' }
      ]
    },
    {
      id: 'rpc',
      default: 'on',
      label: 'HTTP RPC API',
      options: [
        { value: 'none', label: 'Disabled', flag: '' },
        {
          value: 'metamask',
          label: 'Enabled for MetaMask',
          flag:
            '--rpc --rpccorsdomain moz-extension://e582a415-cf54-468e-9b4b-f32b576f7bf7,chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn'
        },
        {
          value: 'on',
          label: 'Enabled for All Origins (*)',
          flag: '--rpc --rpccorsdomain=*'
        }
      ]
    },
    {
      id: 'rcpvhosts',
      default: 'localhost',
      label: 'list of virtual hostnames',
      options: [
        {
          value: 'localhost',
          label: 'Enabled for localhost',
          flag:
            '--rpcvhosts localhost'
        },
        {
          value: 'all',
          label: 'Enabled for All vhosts',
          flag: '--rpcvhosts *'
        }
      ]
    },
    {
      id: 'ws',
      default: 'none',
      label: 'WebSockets API',
      options: [
        { value: 'none', label: 'Disabled', flag: '' },
        {
          value: 'on',
          label: 'Enabled for All Origins (*)',
          flag: '--ws --wsorigins=*'
        }
      ]
    },
    {
      id: 'port',
      label: 'P2P Port',
      flag: '--port %s',
      default: '30303'
    },

    {
      id: 'graphql',
      label: 'Enable GraphQL Server',
      default: 'true',
      options: [
        {
          value: 'true',
          flag: '--graphql --graphql.corsdomain=*',
          label: 'Yes, All Origins (*) (Requires Geth >=v1.9.0)'
        },
        { value: 'false', flag: '', label: 'No' }
      ]
    },
    {
      id: 'signer',
      label: 'Signer',
      default: 'none',
      options: [
        { value: 'none', flag: '', label: 'Internal' },
        {
          value: 'clef',
          flag: '--signer http://localhost:8550',
          label: 'Clef (default: localhost:8550)'
        }
      ]
    },
    {
      id: 'usb',
      label: 'Enable USB (hardware wallets)',
      default: 'false',
      options: [
        { value: 'false', flag: '--nousb', label: 'No' },
        { value: 'true', flag: '', label: 'Yes' }
      ]
    },
    {
      id: 'verbosity',
      label: 'Verbosity',
      default: 3,
      options: [
        { value: 0, label: '0 = Silent', flag: '--loglevel=0' },
        { value: 1, label: '1 = Error', flag: '--loglevel=1' },
        { value: 2, label: '2 = Warn', flag: '--loglevel=2' },
        { value: 3, label: '3 = Info', flag: '' }, // Geth's default
        { value: 4, label: '4 = Debug', flag: '--loglevel=4' },
        { value: 5, label: '5 = Detail', flag: '--loglevel=5' }
      ]
    },
    {
      id: 'ipcdisabled',
      label: 'IPC Disabled',
      default: 'true',
      options: [
        { value: 'true', flag: '--ipcdisable', label: 'Yes' },
      ]
    },
  ],
  about: {
    description:
      'Blockchain Federal Argentina (BFA) es una plataforma multiservicios abierta y participativa pensada para integrar servicios y aplicaciones sobre blockchain',
    apps: [
      {
        name: 'Block Explorer',
        url: 'package://github.com/marcgarreau/grid-blocks-app',
        dependencies: [
          {
            name: 'BFA.testnet',
            settings: [{ id: 'graphql', value: 'true' }]
          }
        ]
      },
      {
        name: 'GraphQL App',
        url: 'http://localhost:8547',
        dependencies: [
          {
            name: 'BFA.testnet',
            settings: [{ id: 'graphql', value: 'true' }]
          }
        ]

      }
    ],
    links: [
      {
        name: 'Gitlab Repository',
        url: 'https://gitlab.bfa.ar/public'
      }
    ],
    docs: [
      {
        name: 'Official Site',
        url: 'https://bfa.ar/'
      },
      {
        name: 'Wiki',
        url: 'https://gitlab.bfa.ar/blockchain/docs/wikis/home'
      },
      {
        name: 'Mailing List',
        url:
          'https://listas.bfa.ar/listinfo'
      }
    ],
    community: [
      {
        name: 'Telegram Chat',
        url: 'https://t.me/bfatec'
      }
    ]
  }
}
