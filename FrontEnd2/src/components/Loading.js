import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
const Loading = () => {
    return (
        <div>
            <ProgressSpinner style={{width: '120px', height: '120px', color: '#0057e7'}} strokeWidth="5" fill="#EEEEEE" animationDuration=".7s"/>
        </div>
    );
};

export default Loading;