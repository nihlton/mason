const hipsum = `Taxidermy proident hoodie brooklyn PBR&B godard succulents actually. Vice exercitation banh mi kombucha sed squid. Aliqua mumblecore raw denim pitchfork, intelligentsia in blog tote bag glossier normcore vice sartorial narwhal dolore echo park. Irony heirloom do, subway tile XOXO gluten-free magna. Normcore pok pok seitan hella roof party iceland humblebrag disrupt lumbersexual flexitarian mumblecore fingerstache helvetica. Yr laboris iceland, wayfarers proident hell of kitsch tilde palo santo dreamcatcher cupidatat gastropub ea. Tbh sriracha crucifix jianbing semiotics typewriter in et migas tacos.`;

function toHex(n: number) {
  var hex = n.toString(16);
  while (hex.length < 2) {
    hex = "0" + hex;
  }
  return hex;
}
const getRandomColor = () => {
  const r = Math.round(Math.random() * 255);
  const g = Math.round(Math.random() * 255);
  const b = Math.round(Math.random() * 255);
  return toHex(r) + toHex(g) + toHex(b);
};

export const randomEntries = new Array(80).fill(".").map(() => {
  const textStart = Math.round(Math.random() * 400);
  const height = Math.round(Math.random() * 300) + 100;
  const text = hipsum.slice(textStart, textStart + height / 5);
  return (
    <div className="random-entry">
      <div className="entry-content">
        <img src={`https://dummyimage.com/300x${height}/${getRandomColor()}.png&text=+`} alt="colors!" />
        <p>{text}</p>
      </div>
    </div>
  );
});

export const randomColors = new Array(80).fill(".").map(() => {
  const height = Math.round(Math.random() * 300) + 100;
  return <img style={{ display: "block" }} src={`https://dummyimage.com/300x${height}/${getRandomColor()}.png&text=+`} alt="colors!" />;
});

export const columnConfig = {
  small: {
    query: "(max-width: 720px)",
    columns: 2,
  },
  medium: {
    query: "(min-width: calc(720px + 1px)) and (max-width: calc(1023px - 1px) )",
    columns: 3,
  },
  large: {
    query: "(min-width: 1023px)",
    columns: 4,
  },
};

export const columnConfigImages = {
  small: {
    query: "(max-width: 720px)",
    columns: 3,
  },
  medium: {
    query: "(min-width: calc(720px + 1px)) and (max-width: calc(1023px - 1px) )",
    columns: 4,
  },
  large: {
    query: "(min-width: 1023px)",
    columns: 5,
  },
};

export const staticColumn = {
  default: {
    columns: 3,
  },
};
