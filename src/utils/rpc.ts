const MONAD_RPC = 'https://testnet-rpc.monad.xyz';

export const makeRPCCall = async (method: string, params: any[] = []): Promise<any> => {
  try {
    const response = await fetch(MONAD_RPC, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method,
        params,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }
    return data.result;
  } catch (error) {
    console.error(`RPC call failed for ${method}:`, error);
    throw error;
  }
};