import * as AWS from '@aws-sdk/client-redshift-data';
import pRetry from 'p-retry';

const { RedshiftDataClient,
  GetStatementResultCommand,
  ExecuteStatementCommand } = AWS;

const client = new RedshiftDataClient({ region: 'us-east-1'});
const ExecuteStatementParams = { 'ClusterIdentifier': 'redshift-cluster-1',
  'DbUser': 'awsuser',
  'Database': 'dev',
  'Sql': 'select * from R_SCORES;'};
const ExecuteCommand = new ExecuteStatementCommand(ExecuteStatementParams);

export const handler = async(event, context) => {
  try {
    const { Id } = await client.send(ExecuteCommand);
    const GetResultParams = {Id};
    const GetStatementCommand = new GetStatementResultCommand(GetResultParams);
    const data = await pRetry(() =>
      retryFun(client, GetStatementCommand), retryConfig);
    return {
      statusCode: 200,
      body: data.Records
    };

  } catch (error) {
    console.log('Error while retrieving the data from Redshift', error);
  }

};


const retryConfig = {onFailedAttempt: (error) => {
  console.log(`GetStatementCommand Attempt ${error.attemptNumber} failed. 
    There are ${error.retriesLeft} retries left.`);
}, retries: 5};


const retryFun = async(client, GetStatementCommand) => {
  try {
    const result = await client.send(GetStatementCommand);
    return result;
  } catch (e) {
    if (e.name !== 'ResourceNotFoundException') {
      throw new pRetry.AbortError('ResourceNotFoundException');
    }
    throw e;
  }
};
