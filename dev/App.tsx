import Mason from "../src/react-stone-mason";
import { columnConfig, columnConfigImages, randomColors, randomEntries, staticColumn } from "./util";

import "./App.css";

const App = () => {
  return (
    <div className="App">
      <h1>Responsive</h1>
      <h2>HTML children with gutter</h2>
      <Mason columns={columnConfig}>{randomEntries.slice(0, 16)}</Mason>

      <h2>Plain image children, no gutter</h2>
      <Mason columns={columnConfigImages}>{randomColors.slice(0, 24)}</Mason>

      <h1>Static</h1>
      <Mason columns={staticColumn}>{randomEntries.slice(0, 16)}</Mason>
    </div>
  );
};

export default App;
