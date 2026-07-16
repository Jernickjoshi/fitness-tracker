import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
function ProgressChart({ sortedWorkouts }) {
  return (
    <div>
      <h1>Weight Progress Chart</h1>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={sortedWorkouts}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis dataKey="date" stroke="#fff" tick={{ fill: "#fff" }} />
          <YAxis
            stroke="#fff"
            tick={{ fill: "#fff" }}
            domain={["dataMin - 2", "dataMax + 2"]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#2a2a2a",
              border: "1px solid #1db954",
              borderRadius: "8px",
              color: "#fff",
            }}
            itemStyle={{ color: "#1db954" }}
          />
          <Line
            type="monotone"
            dataKey="body_weight_kg"
            name="Weight(kg)"
            stroke="#1db954"
            strokeWidth={3}
            dot={{
              r: 5,
              fill: "#121212",
              stroke: "#1db954",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProgressChart;
