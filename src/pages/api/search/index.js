import Thread from '../../../model/thread';

const { Document } = require('flexsearch');

const cache = {
  expiredAt: 0,
  threads: null,
};

export default async (req, res) => {
  try {
    const { q, size } = req.query;
    const activeSize = Math.min(100, Math.max(1, Number(size) || 20));

    if (!cache.threads || Date.now() > cache.expiredAt) {
      cache.threads = await Thread.getAllForSearch();
      cache.expiredAt = Date.now() + 5 * 60 * 1000; // 5 mins
    }

    const threads = Array.isArray(cache.threads) ? cache.threads : [];

    const document = new Document({
      tokenize: 'forward',
      document: {
        id: 'tid',
        index: ['title', 'text'],
      },
    });

    threads.forEach((t) => document.add(t));

    const searchResult = document.search(q);

    const resultIds = new Set([].concat(...searchResult.map((re) => re.result)));
    const resultThreads = threads.filter((t) => resultIds.has(t.tid)).slice(0, activeSize);

    // TODO: improve indexing by storing it and avoid re-calculation
    // const fullIndex = {};
    // await document.export((key, data) => {
    //   console.log('export', key, data)
    //   fullIndex[key] = data
    // })

    res.json({
      status: 'ok',
      payload: {
        threads: resultThreads,
      },
    });
  } catch (e) {
    res.status(500).json({ error: 'Unexpected error.', description: e });
  }
};
