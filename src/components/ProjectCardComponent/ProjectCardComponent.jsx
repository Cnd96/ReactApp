import React from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const ProjectCard = (props) => (
  <Card onClick={props.onCardClick} >
    <img src={props.image} alt="Delay Report" className="img-fluid"/>
      <CardContent>
      <Typography variant="h6"  component="h2">
          {props.projectTitle}
      </Typography>

      <Typography variant="body" color="textSecondary" component="p">
         {props.projectDescription}
      </Typography>
      </CardContent>
      {/* <CardActions>
      </CardActions> */}
  </Card>
);

export default ProjectCard;