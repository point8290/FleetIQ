rs.initiate({
  _id: "rs-shard-1",
  members: [
    { _id: 0, host: "shard1-1:27018" },
    { _id: 1, host: "shard1-2:27022" },
    { _id: 2, host: "shard1-3:27023" },
  ],
});

rs.initiate({
  _id: "rs-config",
  configsvr: true,
  members: [
    { _id: 0, host: "configsvr1:27019" },
    { _id: 1, host: "configsvr2:27020" },
    { _id: 2, host: "configsvr3:27021" },
  ],
});
