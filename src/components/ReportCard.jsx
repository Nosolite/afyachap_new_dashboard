import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import { webGetRequest } from "../../src/services/api-service";

import icon1 from "../../src/assets/images/svgs/icon-connect.svg";
import icon2 from "../../src/assets/images/svgs/icon-user-male.svg";
import icon3 from "../../src/assets/images/svgs/icon-briefcase.svg";
import icon4 from "../../src/assets/images/svgs/icon-mailbox.svg";
import icon5 from "../../src/assets/images/svgs/icon-favorites.svg";
import icon6 from "../../src/assets/images/svgs/icon-speech-bubble.svg";

const initialTopcards = [
  {
    href: "/user-profile",
    icon: icon2,
    serviceId: "",
    title: "Premium Accounts",
    digits: null,
    bgcolor: "primary",
  },
  {
    href: "/apps/blog/posts",
    icon: icon3,
    serviceId: "",
    title: "Free Accounts",
    digits: null,
    bgcolor: "warning",
  },
  {
    href: "/payments/accounts-expires-tomorrow",
    icon: icon4,
    serviceId: "",
    title: "Expires Tomorrow",
    digits: null,
    bgcolor: "error",
  },
  {
    href: "/apps/email",
    icon: icon5,
    serviceId: 2,
    title: "App Subscription Revenue",
    digits: null,
    bgcolor: "warning",
  },
  {
    href: "/apps/chats",
    icon: icon6,
    serviceId: 3,
    title: "Product Revenue",
    digits: null,
    bgcolor: "success",
  },
  {
    href: "/apps/contacts",
    icon: icon1,
    serviceId: 1,
    title: "Consultation Revenue",
    digits: null,
    bgcolor: "info",
  },
];

const formatToCurrency = (amount, currency = "TZS") => {
  return new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency,
  }).format(amount);
};

const ReportCard = () => {
  const [topcards, setTopcards] = useState(initialTopcards);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const fetchPromises = topcards.map((card, index) => {
        if (card.serviceId) {
          return webGetRequest(
            `https://afyachap.com/api/total-revenue/${card.serviceId}`,
            (result) => {
              const amount = result.totalAmount || 0;
              setTopcards((prevTopcards) =>
                prevTopcards.map((prevCard, i) =>
                  i === index
                    ? { ...prevCard, digits: formatToCurrency(amount) }
                    : prevCard
                )
              );
            },
            (error) => {
              console.error(
                "Error fetching data for service ID:",
                card.serviceId,
                error
              );
              setTopcards((prevTopcards) =>
                prevTopcards.map((prevCard, i) =>
                  i === index
                    ? { ...prevCard, digits: formatToCurrency(0) }
                    : prevCard
                )
              );
            }
          );
        } else if (card.title === "Free Accounts") {
          return webGetRequest(
            "https://afyachap.com/api/v1/users/counts/free_accounts",
            (result) => {
              const count = result.total_free_accounts || 0;
              setTopcards((prevTopcards) =>
                prevTopcards.map((prevCard, i) =>
                  i === index ? { ...prevCard, digits: count } : prevCard
                )
              );
            },
            (error) => {
              console.error("Error fetching free accounts count:", error);
              setTopcards((prevTopcards) =>
                prevTopcards.map((prevCard, i) =>
                  i === index ? { ...prevCard, digits: 0 } : prevCard
                )
              );
            }
          );
        } else if (card.title === "Premium Accounts") {
          return webGetRequest(
            "https://afyachap.com/api/v1/users/counts/premium_accounts",
            (result) => {
              const count = result.total_premium_accounts || 0;
              setTopcards((prevTopcards) =>
                prevTopcards.map((prevCard, i) =>
                  i === index ? { ...prevCard, digits: count } : prevCard
                )
              );
            },
            (error) => {
              console.error("Error fetching premium accounts count:", error);
              setTopcards((prevTopcards) =>
                prevTopcards.map((prevCard, i) =>
                  i === index ? { ...prevCard, digits: 0 } : prevCard
                )
              );
            }
          );
        } else if (card.title === "Expires Tomorrow") {
          return webGetRequest(
            "https://afyachap.com/api/v1/user-total-account-expire-tommorrow",
            (result) => {
              const count = result.Total_account_to_expire_tommorow;
              setTopcards((prevTopcards) =>
                prevTopcards.map((prevCard, i) =>
                  i === index ? { ...prevCard, digits: count } : prevCard
                )
              );
            },
            (error) => {
              console.error(
                "Error fetching expiring tommorrow accounts :",
                error
              );
              setTopcards((prevTopcards) =>
                prevTopcards.map((prevCard, i) =>
                  i === index ? { ...prevCard, digits: 0 } : prevCard
                )
              );
            }
          );
        }
        return Promise.resolve();
      });

      await Promise.all(fetchPromises);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <Grid container spacing={3} mt={3}>
      {topcards.map((topcard, i) => (
        <Grid item xs={12} sm={4} lg={4} key={i}>
          <Link to={topcard.href}>
            <Box bgcolor={topcard.bgcolor + ".lightest"} textAlign="center">
              <CardContent>
                <img src={topcard.icon} alt={topcard.title} width="50" />
                <Typography
                  color={topcard.bgcolor + ".main"}
                  mt={1}
                  variant="subtitle1"
                  fontWeight={600}
                >
                  {topcard.title}
                </Typography>
                <Typography
                  color={topcard.bgcolor + ".main"}
                  variant="h4"
                  fontWeight={600}
                >
                  {topcard.digits !== null ? (
                    topcard.digits
                  ) : (
                    <CircularProgress
                      size={26}
                      sx={{
                        color: topcard.bgcolor + ".main",
                      }}
                    />
                  )}
                </Typography>
              </CardContent>
            </Box>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
};

export default ReportCard;
