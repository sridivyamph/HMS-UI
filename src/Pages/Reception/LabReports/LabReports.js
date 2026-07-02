import {
  Box,
  Typography,
  Grid,
  Container,
  Button,
  Skeleton,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  getListedReports,
  downloadReportDoc,
} from "../../../Redux/Modules/LabTechnician/LabThunk";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import ReceptionHeader from "../../../Components/Header/ReceptionHeader";
import { useSelector } from "react-redux";
const LabReports = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [labReports, setLabReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ListLoader = async () => {
      try {
        setLoading(true);
        const result = await dispatch(getListedReports(id));
        setLabReports(result.payload.content || []);
      } catch (err) {
        console.error("Error loading lab reports:", err);
      } finally {
        setLoading(false);
      }
    };
    ListLoader();
  }, [dispatch, id]);

  const linkToDownload = async (id, fileName) => {
    try {
      const result = await dispatch(downloadReportDoc(id));
      const blob = result.payload;
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const navigate = useNavigate();

  const renderSkeletonLoader = () => {
    const rows = Array.from({ length: 4 });

    return (
      <>
        <Skeleton variant="text" width={180} height={40} sx={{ mt: 6 }} />
        <Grid container spacing={2} sx={{ mt: 5 }}>
          {[
            "Date of Report",
            "Report Name",
            "Category",
            "Report Status",
            "Lab Reports",
          ].map((_, idx) => (
            <Grid item xs={idx === 4 ? 3 : 2} key={idx}>
              <Skeleton variant="text" height={30} />
            </Grid>
          ))}
        </Grid>

        {rows.map((_, index) => (
          <Grid container spacing={2} key={index} sx={{ mt: 2 }}>
            <Grid item xs={2}>
              <Skeleton variant="text" height={25} />
            </Grid>
            <Grid item xs={2}>
              <Skeleton variant="text" width="80%" height={25} />
            </Grid>
            <Grid item xs={2}>
              <Skeleton variant="rectangular" width="90%" height={25} />
            </Grid>
            <Grid item xs={2}>
              <Skeleton variant="text" width="95%" height={25} />
            </Grid>
            <Grid item xs={4}>
              <Skeleton variant="text" width="80%" height={25} />
            </Grid>
          </Grid>
        ))}
      </>
    );
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#F9F9F9",
        }}
      >
        <ReceptionHeader />
        <Container sx={{ py: 5 }} disableGutters>
          <Box sx={{ display: "flex", pt: 6 }}>
            <Button onClick={() => navigate(-1)}>
              <ArrowBackIosIcon
                sx={{ ml: "4px", color: "#2B2A29", fontSize: 24 }}
              />
              <Typography
                sx={{ fontWeight: 600, color: "#2B2A29", fontSize: 24 }}
              >
                Lab Reports
              </Typography>
            </Button>
          </Box>

          {loading ? (
            renderSkeletonLoader()
          ) : labReports.length === 0 ? (
            <Box sx={{ mt: 6, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                No lab reports found.
              </Typography>
            </Box>
          ) : (
            <>
              <Grid
                container
                spacing={2}
                sx={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  color: "#6E6E6E",
                  mt: 5,
                }}
              >
                <Grid item xs={2}>
                  Date of Report
                </Grid>
                <Grid item xs={2}>
                  Report Name
                </Grid>
                <Grid item xs={2}>
                  Category
                </Grid>
                <Grid item xs={2}>
                  Report Status
                </Grid>
                <Grid item xs={4}>
                  Lab Reports
                </Grid>
              </Grid>

              {labReports.map((report) => (
                <Grid
                  container
                  spacing={2}
                  key={report.id}
                  sx={{ mt: 1, color: "#2B2A29" }}
                >
                  <Grid item xs={2}>
                    <Typography>{report.reportDate}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography>{report.reportName}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography>{report.category}</Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography>{report.reportStatus}</Typography>
                  </Grid>
                  {report.reportStatus !== "Pending" && (
                    <Grid item xs={4}>
                      <Button
                        onClick={() =>
                          linkToDownload(report.id, report.fileName)
                        }
                        sx={{
                          fontWeight: "bold",
                          textDecoration: "underline",
                          fontSize: 16,
                          textTransform: "none",
                          padding: 0,
                        }}
                      >
                        {report.fileName}
                      </Button>
                    </Grid>
                  )}
                </Grid>
              ))}
            </>
          )}
        </Container>
      </Box>
    </>
  );
};

export default LabReports;
