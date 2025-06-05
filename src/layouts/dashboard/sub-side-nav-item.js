import PropTypes from 'prop-types';
import { ListItemButton, ListItemText, } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

export const SubSideNavItem = (props) => {
    const { path, title } = props;
    const router = useLocation();
    const { pathname } = router;
    const active = path ? (pathname === path) : false;
    const navigate = useNavigate();

    return (
        <ListItemButton
            onClick={() => {
                navigate(path);
            }}
            disableGutters
            sx={{
                pl: '16px',
                py: '6px',
                borderRadius: "26px",
                color: 'text.primary',
                '&:hover': {
                    backgroundColor: active ? 'primary.main' : 'primary.lightest'
                },
                ...(active && {
                    backgroundColor: 'primary.main',
                    color: 'neutral.100',
                }),
            }}
        >
            <ListItemText
                primary={title}
            />
        </ListItemButton>
    );
};

SubSideNavItem.propTypes = {
    path: PropTypes.string,
    title: PropTypes.string.isRequired
};
