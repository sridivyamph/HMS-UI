import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Grid,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Link,
    Card,
    CardContent,
    Avatar,
    AppBar,
    Toolbar,
    IconButton,
    Button,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import NotificationsIcon from "@mui/icons-material/Notifications";
import Logo from '../../../assets/Logo.svg';
import Footer from '../../../Components/Footer/footer';
import { useNavigate } from 'react-router-dom';
import ReceptionHeader from '../../../Components/Header/ReceptionHeader';
import { useSelector } from 'react-redux';
const ReceptionProfile = () => {
    const navigate = useNavigate();

    // Replace this with real fetched data
    const userData = [
        { label: 'Name', value: 'Jane' },
        { label: 'Gender', value: 'Female' },
        { label: 'Age', value: '23' },
        { label: 'Occupation', value: 'Receptionist' },
        { label: 'Email', value: 'janesusan@gmail.com' },
        { label: 'Phone', value: '+1 6482347281' },
    ];

    // Populate with real qualification data
    const educationData = [
        { institution: 'ABC College', degree: 'B.SC', year: '2023' },
        { institution: 'XYZ High School', degree: 'High School Diploma', year: '2019' },
    ];

    const receptionName = useSelector((state) => state.reception.receptionData.username);
    return (
        <>
            <ReceptionHeader receptionistName={receptionName}/>
            <Box sx={{ backgroundColor: '#F9F9F9', mb: 6 }}>
                <Container>
                    <Box sx={{ display: 'flex', pt: 6 }}>
                        <Button onClick={() => navigate(-1)} startIcon={<ArrowBackIosIcon />}>
                            <Typography sx={{ fontWeight: 600, fontSize: 24 }}>DashBoard</Typography>
                        </Button>
                    </Box>

                    <Grid container spacing={2} sx={{ mt: 5 }}>
                        <Grid item xs={3}>
                            <Card sx={{ borderRadius: '4px', backgroundColor: '#04BA8E05' }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Avatar
                                        src='https://via.placeholder.com/150'
                                        alt='Receptionist'
                                        sx={{ width: 110, height: 110, mx: 'auto', mb: 2 }}
                                    />

                                    <Box sx={{ mt: 2, textAlign: 'left' }}>
                                        <Box sx={{ pt: 2 }}>
                                            <Typography variant='body1' color='#6E6E6E'>Name</Typography>
                                            <Typography variant='body1' color='#2B2A29' sx={{ pt: 1 }}>
                                                {receptionName}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={9}>
                            <Box sx={{ backgroundColor: '#fff', borderRadius: 2, py: 4, px: 3 }}>
                                {/* Personal Information Accordion */}
                                <Accordion sx={{ mb: 2, backgroundColor: '#04BA8E0A', borderRadius: 1 }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon sx={{ color: '#04BA8E' }} />}
                                        sx={{ fontWeight: 'bold', fontSize: 16 }}
                                    >
                                        Personal Information
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container spacing={2} sx={{ py: 2 }}>
                                            <Grid item xs={6}>
                                                <Typography variant='subtitle2'>Field</Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant='subtitle2'>Detail</Typography>
                                            </Grid>
                                            {userData.map((info, idx) => (
                                                <React.Fragment key={idx}>
                                                    <Grid item xs={6}>{info.label}</Grid>
                                                    <Grid item xs={6}>{info.value}</Grid>
                                                </React.Fragment>
                                            ))}
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>

                                {/* Education Qualification Accordion */}
                                <Accordion sx={{ mb: 2, backgroundColor: '#04BA8E0A', borderRadius: 1 }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon sx={{ color: '#04BA8E' }} />}
                                        sx={{ fontWeight: 'bold', fontSize: 16 }}
                                    >
                                        Education Qualification
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container spacing={2} sx={{ py: 2 }}>
                                            <Grid item xs={4}>
                                                <Typography variant='subtitle2'>Institution</Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography variant='subtitle2'>Degree</Typography>
                                            </Grid>
                                            <Grid item xs={4}>
                                                <Typography variant='subtitle2'>Year</Typography>
                                            </Grid>
                                            {educationData.map((edu, idx) => (
                                                <React.Fragment key={idx}>
                                                    <Grid item xs={4}>{edu.institution}</Grid>
                                                    <Grid item xs={4}>{edu.degree}</Grid>
                                                    <Grid item xs={4}>{edu.year}</Grid>
                                                </React.Fragment>
                                            ))}
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Footer />
        </>
    );
};

export default ReceptionProfile;
