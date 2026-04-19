import { Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@mui/material";
import { useContext, useState } from "react";
import SortIcon from "@mui/icons-material/Sort";
import { PointsPerPosition } from "../../Models/PointsPerPosition";
import { RaceDataContext } from "./Leaderboard";

function PointsDialog() {
    const contextData = useContext(RaceDataContext);
    const [pointsPerPosition, setPointsPerPosition] = contextData!.pointsPerPosition;
    const updatePoints = (points: PointsPerPosition, value: string) => {
        //useRef
        const updatedPointsPerPosition = pointsPerPosition.map((pointData) => {
            //onblur
            if (pointData.position === points.position) {
                if (!isNaN(parseInt(value))) {
                    points.points = parseInt(value);
                } else {
                    points.points = 0;
                }
                return points;
            } else return pointData;
        });
        setPointsPerPosition(updatedPointsPerPosition);
    };

    const [pointsDialogOpen, setPointsDialogOpen] = useState(false)

    const handleClose = () => {
        setPointsDialogOpen(false);
    };

    return (
        <>
            <Button
                color="warning"
                variant="contained"
                onClick={() => setPointsDialogOpen(true)}
                startIcon={<SortIcon />}
            >
                Customise Points Gain
            </Button>
            {/* Dialog for points customization */}
            <Dialog open={pointsDialogOpen} onClose={handleClose}>
                <DialogTitle>
                    Customise points gained for each position
                </DialogTitle>
                <DialogContent>
                    {pointsPerPosition.map((pointData) => (
                        <div style={{ display: "flex" }}>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Position"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={pointData.position}
                                disabled
                            />
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Points Gained"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={pointData.points}
                                onChange={(event) =>
                                    updatePoints(pointData, event.target.value)
                                }
                            />
                        </div>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default PointsDialog;
