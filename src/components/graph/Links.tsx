/*
Author: Eli Elad Elrom
Website: https://EliElrom.com
License: MIT License
Component: src/component/SimpleForceGraph/Links.tsx
*/

import * as React from 'react';

import {link} from '~src/models/GraphViewModels';

import Link from './Link';

export default function Links(props: ILinksProps): JSX.Element {
    const links = props.links.map((link: link) => {
        return <Link key={`links-${link.source}-${link.target}`} link={link} />;
    });
    return <g className="links">{links}</g>;
}

interface ILinksProps {
    links: link[];
}
