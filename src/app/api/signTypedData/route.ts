import { TappdClient } from '@phala/dstack-sdk'
import { toViemAccountSecure } from '@phala/dstack-sdk/viem'

const domain = {
  name: 'Ether Mail',
  version: '1',
  chainId: 1,
  verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
}

const types = {
  Person: [
    { name: 'name', type: 'string' },
    { name: 'wallet', type: 'address' },
  ],
  Mail: [
    { name: 'from', type: 'Person' },
    { name: 'to', type: 'Person' },
    { name: 'contents', type: 'string' },
  ],
}

export const dynamic = 'force-dynamic'

export async function GET() {
  const message = {
    from: {
      name: 'Cow',
      wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
    },
    to: {
      name: 't/acc',
      wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
    },
    contents: 'Hello, t/acc!',
  };
  const client = new TappdClient()
  const testDeriveKey = await client.deriveKey("ethereum");
  const account = toViemAccountSecure(testDeriveKey);
  console.log(`Account [${account.address}] Signing Typed Message [${message}]`);
  const signature = await account.signTypedData({
    // @ts-ignore
    domain: domain,
    types,
    primaryType: 'Mail',
    message,
  })
  console.log(`Typed Message Signed [${signature}]`)
  return Response.json({ account: account.address, message: message, signature: signature });
}
