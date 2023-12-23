let recordPool = [];

for (let i = 0; i < recordPool.length; i++) {
  document.getElementById('rank').innerHTML = i + 1;
}

async function getRankingRecord() {
  try {
    const response = await axios.post('./get_ranking-record.php')
    dreamStarStore.dreamStarPool.splice(0);
    response.data.forEach(element => {
      const record = {
        name: element.name,
        date: element.date,
        score: element.score
      }
      document.getElementById('name').innerHTML = record.name
      document.getElementById('date').innerHTML = record.date
      document.getElementById('score').innerHTML = record.score
      recordPool.push(record)
    });

  } catch (error) {
    console.error(error);
  }
}

onMounted(() => {
  getRankingRecord()
})