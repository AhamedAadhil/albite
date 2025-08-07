import PuffLoader from "react-spinners/PuffLoader";

export const renderLoader = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        inset: 0,
        height: "100%",
      }}
      className="flex-center"
    >
      <PuffLoader
        size={40}
        color={"#455A81"}
        aria-label="Loading Spinner"
        data-testid="loader"
        speedMultiplier={1}
      />
    </div>
  );
};
