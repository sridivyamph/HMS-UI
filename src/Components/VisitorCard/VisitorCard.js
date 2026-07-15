import { useEffect, useState } from "react";
import { Box, Grid, Paper, Typography, Select, MenuItem } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useDispatch } from "react-redux";
import { fetchMonthlyVisitors } from "../../Redux/Modules/Reception/ReceptionThunk";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const VisitorCard = () => {
  const dispatch = useDispatch();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [labels, setLabels] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentMonthIndex = new Date().getMonth();
  const currentDisplayIndex = hoveredIndex ?? currentMonthIndex;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonthName = currentDate.toLocaleString("default", {
        month: "long",
      });
      const startMonth = `January ${currentYear}`;
      const endMonth = `${currentMonthName} ${currentYear}`;
      const range = `${startMonth} - ${endMonth}`;
      try {
        const action = await dispatch(fetchMonthlyVisitors(range));
        if (fetchMonthlyVisitors.fulfilled.match(action)) {
          const apiData = action.payload;
          const currentYear = new Date().getFullYear();
          const filteredData = apiData.filter((d) => {
            const year = parseInt(d.month.split(" ")[1]);
            return year === currentYear;
          });

          setLabels(filteredData.map((d) => d.month));
          setVisits(filteredData.map((d) => d.visitors));
        } else {
          console.error("Fetch rejected", action.payload);
        }
      } catch (err) {
        console.error("Error dispatching thunk:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  const visitData = {
    labels,
    datasets: [
      {
        label: "Monthly Visits",
        data: visits,
        borderColor: "#4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      },
    ],
  };

  return (
    <Grid item xs={12} md={6}>
      <Paper
        sx={{
          padding: 2,
          height: 200,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Box
          flexGrow={1}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          height="100%"
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontFamily: "Albert Sans",
              fontWeight: 500,
              fontSize: 18,
              lineHeight: "28px",
              letterSpacing: 0,
            }}
          >
            Total Visitors
          </Typography>

          <Box flexGrow={1} minHeight={0}>
            <Line
              data={visitData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                  mode: "index",
                  intersect: false,
                },
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  x: { grid: { display: false } },
                  y: {
                    beginAtZero: true,
                    grid: { display: false },
                    ticks: { stepSize: 10 },
                  },
                },
                onClick: (_, elements) => {
                  if (elements.length) {
                    setHoveredIndex(elements[0].index);
                  } else {
                    setHoveredIndex(null);
                  }
                },
              }}
            />
          </Box>
        </Box>

        <Box
          minWidth={120}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          pl={2}
          height="100%"
        >
          <Select
            value={currentDisplayIndex}
            onChange={(e) => setHoveredIndex(Number(e.target.value))}
            variant="outlined"
            size="small"
            sx={{ mb: 1 }}
            disabled={loading}
          >
            <MenuItem value={-1} disabled>
              Select a Month
            </MenuItem>
            {labels.map((month, idx) => (
              <MenuItem key={month + idx} value={idx}>
                {month}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
            Visitors
          </Typography>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {loading || !visits.length
              ? "..."
              : visits[currentDisplayIndex] ?? 0}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );
};

export default VisitorCard;
