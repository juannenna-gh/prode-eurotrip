const PLAYERS = ['Martin', 'Joaquin', 'Pablo', 'Franco', 'Fede', 'Juan'];

const PLAYER_COLORS = {
  'Martin': '#FF6384',
  'Joaquin': '#36A2EB',
  'Pablo': '#FFCE56',
  'Franco': '#4BC0C0',
  'Fede': '#9966FF',
  'Juan': '#FF9F40'
};

let rankingsChart = null;

const COUNTRIES = {
  // CONMEBOL (South America)
  'ARG': { name: 'Argentina', flag: '🇦🇷' },
  'BRA': { name: 'Brasil', flag: '🇧🇷' },
  'URU': { name: 'Uruguay', flag: '🇺🇾' },
  'CHI': { name: 'Chile', flag: '🇨🇱' },
  'COL': { name: 'Colombia', flag: '🇨🇴' },
  'ECU': { name: 'Ecuador', flag: '🇪🇨' },
  'PER': { name: 'Perú', flag: '🇵🇪' },
  'PAR': { name: 'Paraguay', flag: '🇵🇾' },
  'VEN': { name: 'Venezuela', flag: '🇻🇪' },
  'BOL': { name: 'Bolivia', flag: '🇧🇴' },

  // CONCACAF (North & Central America, Caribbean)
  'MEX': { name: 'México', flag: '🇲🇽' },
  'USA': { name: 'Estados Unidos', flag: '🇺🇸' },
  'CAN': { name: 'Canadá', flag: '🇨🇦' },
  'CRC': { name: 'Costa Rica', flag: '🇨🇷' },
  'JAM': { name: 'Jamaica', flag: '🇯🇲' },
  'PAN': { name: 'Panamá', flag: '🇵🇦' },
  'HON': { name: 'Honduras', flag: '🇭🇳' },
  'TRI': { name: 'Trinidad y Tobago', flag: '🇹🇹' },
  'SLV': { name: 'El Salvador', flag: '🇸🇻' },
  'CUB': { name: 'Cuba', flag: '🇨🇺' },
  'HAI': { name: 'Haití', flag: '🇭🇹' },
  'GUA': { name: 'Guatemala', flag: '🇬🇹' },

  // UEFA (Europe)
  'ESP': { name: 'España', flag: '🇪🇸' },
  'FRA': { name: 'Francia', flag: '🇫🇷' },
  'GER': { name: 'Alemania', flag: '🇩🇪' },
  'ITA': { name: 'Italia', flag: '🇮🇹' },
  'ENG': { name: 'Inglaterra', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  'POR': { name: 'Portugal', flag: '🇵🇹' },
  'NED': { name: 'Países Bajos', flag: '🇳🇱' },
  'BEL': { name: 'Bélgica', flag: '🇧🇪' },
  'CRO': { name: 'Croacia', flag: '🇭🇷' },
  'SUI': { name: 'Suiza', flag: '🇨🇭' },
  'DEN': { name: 'Dinamarca', flag: '🇩🇰' },
  'SWE': { name: 'Suecia', flag: '🇸🇪' },
  'POL': { name: 'Polonia', flag: '🇵🇱' },
  'UKR': { name: 'Ucrania', flag: '🇺🇦' },
  'SRB': { name: 'Serbia', flag: '🇷🇸' },
  'AUT': { name: 'Austria', flag: '🇦🇹' },
  'CZE': { name: 'República Checa', flag: '🇨🇿' },
  'WAL': { name: 'Gales', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  'SCO': { name: 'Escocia', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  'NOR': { name: 'Noruega', flag: '🇳🇴' },
  'ROU': { name: 'Rumania', flag: '🇷🇴' },
  'TUR': { name: 'Turquía', flag: '🇹🇷' },
  'GRE': { name: 'Grecia', flag: '🇬🇷' },
  'HUN': { name: 'Hungría', flag: '🇭🇺' },
  'SVK': { name: 'Eslovaquia', flag: '🇸🇰' },
  'NIR': { name: 'Irlanda del Norte', flag: '🇬🇧' },
  'IRL': { name: 'Irlanda', flag: '🇮🇪' },
  'ISL': { name: 'Islandia', flag: '🇮🇸' },
  'FIN': { name: 'Finlandia', flag: '🇫🇮' },
  'BIH': { name: 'Bosnia y Herzegovina', flag: '🇧🇦' },
  'SVN': { name: 'Eslovenia', flag: '🇸🇮' },
  'ALB': { name: 'Albania', flag: '🇦🇱' },
  'MKD': { name: 'Macedonia del Norte', flag: '🇲🇰' },
  'BUL': { name: 'Bulgaria', flag: '🇧🇬' },
  'RUS': { name: 'Rusia', flag: '🇷🇺' },
  'ISR': { name: 'Israel', flag: '🇮🇱' },

  // AFC (Asia)
  'JPN': { name: 'Japón', flag: '🇯🇵' },
  'KOR': { name: 'Corea del Sur', flag: '🇰🇷' },
  'IRN': { name: 'Irán', flag: '🇮🇷' },
  'KSA': { name: 'Arabia Saudita', flag: '🇸🇦' },
  'AUS': { name: 'Australia', flag: '🇦🇺' },
  'QAT': { name: 'Catar', flag: '🇶🇦' },
  'IRQ': { name: 'Irak', flag: '🇮🇶' },
  'UAE': { name: 'Emiratos Árabes Unidos', flag: '🇦🇪' },
  'CHN': { name: 'China', flag: '🇨🇳' },
  'UZB': { name: 'Uzbekistán', flag: '🇺🇿' },
  'THA': { name: 'Tailandia', flag: '🇹🇭' },
  'VIE': { name: 'Vietnam', flag: '🇻🇳' },
  'OMA': { name: 'Omán', flag: '🇴🇲' },
  'JOR': { name: 'Jordania', flag: '🇯🇴' },
  'BHR': { name: 'Baréin', flag: '🇧🇭' },
  'PRK': { name: 'Corea del Norte', flag: '🇰🇵' },
  'SYR': { name: 'Siria', flag: '🇸🇾' },
  'KUW': { name: 'Kuwait', flag: '🇰🇼' },
  'LIB': { name: 'Líbano', flag: '🇱🇧' },
  'PAL': { name: 'Palestina', flag: '🇵🇸' },
  'IND': { name: 'India', flag: '🇮🇳' },

  // CAF (Africa)
  'MAR': { name: 'Marruecos', flag: '🇲🇦' },
  'TUN': { name: 'Túnez', flag: '🇹🇳' },
  'EGY': { name: 'Egipto', flag: '🇪🇬' },
  'SEN': { name: 'Senegal', flag: '🇸🇳' },
  'NGA': { name: 'Nigeria', flag: '🇳🇬' },
  'CMR': { name: 'Camerún', flag: '🇨🇲' },
  'GHA': { name: 'Ghana', flag: '🇬🇭' },
  'RSA': { name: 'Sudáfrica', flag: '🇿🇦' },
  'CIV': { name: 'Costa de Marfil', flag: '🇨🇮' },
  'ALG': { name: 'Argelia', flag: '🇩🇿' },
  'MLI': { name: 'Mali', flag: '🇲🇱' },
  'BFA': { name: 'Burkina Faso', flag: '🇧🇫' },
  'GAB': { name: 'Gabón', flag: '🇬🇦' },
  'CGO': { name: 'Congo', flag: '🇨🇬' },
  'UGA': { name: 'Uganda', flag: '🇺🇬' },
  'ZAM': { name: 'Zambia', flag: '🇿🇲' },
  'CPV': { name: 'Cabo Verde', flag: '🇨🇻' },
  'GNB': { name: 'Guinea-Bisáu', flag: '🇬🇼' },
  'GUI': { name: 'Guinea', flag: '🇬🇳' },
  'KEN': { name: 'Kenia', flag: '🇰🇪' },
  'ANG': { name: 'Angola', flag: '🇦🇴' },
  'BEN': { name: 'Benín', flag: '🇧🇯' },
  'TOG': { name: 'Togo', flag: '🇹🇬' },
  'ZIM': { name: 'Zimbabue', flag: '🇿🇼' },
  'NAM': { name: 'Namibia', flag: '🇳🇦' },
  'MOZ': { name: 'Mozambique', flag: '🇲🇿' },
  'LBY': { name: 'Libia', flag: '🇱🇾' },
  'MTN': { name: 'Mauritania', flag: '🇲🇷' },

  // OFC (Oceania)
  'NZL': { name: 'Nueva Zelanda', flag: '🇳🇿' },
};

function formatTeam(code) {
  const country = COUNTRIES[code.toUpperCase()];
  if (country) {
    return `${country.flag} ${country.name}`;
  }
  return code;
}

function formatTeamReverse(code) {
  const country = COUNTRIES[code.toUpperCase()];
  if (country) {
    return `${country.name} ${country.flag}`;
  }
  return code;
}

async function loadRankings() {
  const response = await fetch('/api/rankings');
  const rankings = await response.json();

  const tbody = document.getElementById('rankings-body');
  tbody.innerHTML = rankings.map((r, index) => `
    <tr>
      <td>${index + 1}${index === 0 ? ' 👑' : ''}</td>
      <td>${r.player}</td>
      <td><strong>${r.points}</strong></td>
      <td>${r.exactos}</td>
      <td>${r.acertados}</td>
      <td>${r.errados}</td>
    </tr>
  `).join('');

  await loadRankingsChart();
}

async function loadRankingsChart() {
  const matchesResponse = await fetch('/api/matches');
  const matches = await matchesResponse.json();

  const completedMatches = matches.filter(m => m.actualResult);

  if (completedMatches.length === 0) {
    const ctx = document.getElementById('rankings-chart');
    if (rankingsChart) {
      rankingsChart.destroy();
      rankingsChart = null;
    }
    ctx.style.display = 'none';
    return;
  }

  const pointsHistory = {};
  PLAYERS.forEach(player => {
    pointsHistory[player] = [0];
  });

  completedMatches.forEach(match => {
    PLAYERS.forEach(player => {
      const lastPoints = pointsHistory[player][pointsHistory[player].length - 1];
      const prediction = match.predictions[player];
      const points = calculatePoints(prediction, match.actualResult);
      pointsHistory[player].push(lastPoints + points);
    });
  });

  const labels = ['Start', ...completedMatches.map((m, i) => `Match ${i + 1}`)];

  const datasets = PLAYERS.map(player => ({
    label: player,
    data: pointsHistory[player],
    borderColor: PLAYER_COLORS[player],
    backgroundColor: PLAYER_COLORS[player] + '20',
    tension: 0.4,
    borderWidth: 2
  }));

  const ctx = document.getElementById('rankings-chart');
  ctx.style.display = 'block';

  if (rankingsChart) {
    rankingsChart.destroy();
  }

  rankingsChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

async function loadMatches() {
  const response = await fetch('/api/matches');
  const matches = await response.json();

  const container = document.getElementById('matches-container');

  if (matches.length === 0) {
    container.innerHTML = '<p style="color: #999;">No matches yet.</p>';
    return;
  }

  container.innerHTML = matches.map(match => {
    const resultDisplay = match.actualResult
      ? match.actualResult.split('-').join(':')
      : '-:-';

    return `
    <div class="match-card">
      <div class="match-header-view">
        <div class="match-teams-centered">${formatTeam(match.teamA)} ${resultDisplay} ${formatTeamReverse(match.teamB)}</div>
      </div>
      ${match.actualResult ? `
        <div class="predictions-list">
          ${PLAYERS.map(player => {
            const prediction = match.predictions[player];
            const points = calculatePoints(prediction, match.actualResult);
            const pointsClass = points === 3 ? 'exact' :
                               points === 1 ? 'partial' : 'none';

            return `
              <div class="prediction-item-view">
                <span class="player-name">${player}</span>
                <span class="prediction-value">${prediction || '-'}</span>
                <span class="points ${pointsClass}">${points}pt</span>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}
    </div>
  `;
  }).join('');
}

function calculatePoints(prediction, actual) {
  if (!prediction || !actual) return 0;

  const [predHome, predAway] = prediction.split('-').map(Number);
  const [actHome, actAway] = actual.split('-').map(Number);

  if (isNaN(predHome) || isNaN(predAway) || isNaN(actHome) || isNaN(actAway)) return 0;

  if (predHome === actHome && predAway === actAway) {
    return 3;
  }

  const predOutcome = predHome > predAway ? 'home' : predHome < predAway ? 'away' : 'draw';
  const actOutcome = actHome > actAway ? 'home' : actHome < actAway ? 'away' : 'draw';

  if (predOutcome === actOutcome) {
    return 1;
  }

  return 0;
}

async function refresh() {
  await Promise.all([loadRankings(), loadMatches()]);
}

// Auto-refresh every 30 seconds
setInterval(refresh, 30000);

refresh();
