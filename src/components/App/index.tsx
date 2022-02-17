import React, { memo } from 'react';

function App(): React.ReactElement {
  return (
    <main>
      Hello world, this react app is created by <code>npx create-react-app with template --choffee</code>.
    </main>
  );
}

export default memo(App);
