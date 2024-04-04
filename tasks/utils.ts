import prompts from 'prompts';

export async function getInput(promptTitle: string, message: string): Promise<string> {
  const response: prompts.PromptObject<string> = await prompts({
    type: 'text',
    name: 'input',
    message: message,
  });

  return response.input;
}

export async function processTransactionReceipt(trx: any): Promise<string> {
  let message = '';

  // Check if trx is a transaction receipt
  if (typeof trx === 'object' && trx.transactionHash && trx.blockNumber !== undefined) {
    if (trx.status === 0) {
      throw new Error("Transaction failed");
    }

    // Constructing the message for a transaction receipt
    message = `- Hash: ${trx.transactionHash}\n` +
              `- Block: ${trx.blockNumber}\n` +
              `- Gas Used: ${trx.gasUsed.toString()}\n\n`;

    if (!trx.events || trx.events.length === 0) {
      message += "No events were emitted by the transaction.\n\n";
    } else {
      message += `Events Emitted: ${trx.events.length}\n\n`;
      trx.events.forEach((event: any, index: number) => {
        let eventMessage = `Event ${index + 1} Details:\n` +
                           `  - Address: ${event.address}\n` +
                           `  - Topics: ${event.topics.join(', ')}\n` +
                           `  - Data: ${event.data}\n\n`;
        
        message += eventMessage;
      });
    }
  } else {
    // Handling for non-transaction receipt responses (smart contract read operations)
    return formatReadResult(trx);
  }
  return message.trim();
}

function formatReadResult(result: any): string {
  if (typeof result === 'string' || typeof result === 'number' || typeof result === 'boolean') {
    return `Read Result: ${result}`;
  } else if (Array.isArray(result)) {
    // For arrays, including bytes and array of values
    return `Read Result: [${result.map(item => formatReadResult(item)).join(', ')}]`;
  } else if (typeof result === 'object') {
    // For objects, including structs and mappings
    try {
      return `Read Object Result: ${JSON.stringify(result, null, 2)}`;
    } catch (error) {
      return "Failed to stringify read object result.";
    }
  } else {
    return "Received data does not appear to be a recognized format.";
  }
}
