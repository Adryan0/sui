// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect, beforeAll } from 'vitest';
import { setup, TestToolbox } from './utils/setup';

describe('Transaction Reading API', () => {
  let toolbox: TestToolbox;

  beforeAll(async () => {
    toolbox = await setup();
  });

  it('Get Total Transactions', async () => {
    const numTransactions = await toolbox.provider.getTotalTransactionNumber();
    expect(numTransactions).to.greaterThan(0);
  });

  it('Get Transaction', async () => {
    const resp = await toolbox.provider.getTransactions('All', null, 1);
    const digest = resp.data[0];
    const txn = await toolbox.provider.getTransactionWithEffects(digest);
    expect(txn.certificate.transactionDigest).toEqual(digest);
  });

  it('Get Transaction Auth Signers', async () => {
    const resp = await toolbox.provider.getTransactions('All', null, 1);
    const digest = resp.data[0];
    const res = await toolbox.provider.getTransactionAuthSigners(digest);
    expect(res.signers.length).greaterThan(0);
  });

  it('Get Transactions', async () => {
    const resp = await toolbox.provider.getTransactionsForAddress(
      toolbox.address(),
      false
    );
    expect(resp.length).to.greaterThan(0);

    const allTransactions = await toolbox.provider.getTransactions(
      'All',
      null,
      10
    );
    expect(allTransactions.data.length).to.greaterThan(0);

    const resp2 = await toolbox.provider.getTransactions(
      { ToAddress: toolbox.address() },
      null,
      null
    );
    const resp3 = await toolbox.provider.getTransactions(
      { FromAddress: toolbox.address() },
      null,
      null
    );
    expect([...resp2.data, ...resp3.data]).toEqual(resp);
  });
});
