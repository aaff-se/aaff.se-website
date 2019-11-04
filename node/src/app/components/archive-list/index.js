'use strict';

import React from 'react';

import ArchiveItem from 'components/archive-item';

import Section from 'components/parts/section';
import Group from 'components/parts/group';
import Item from 'components/parts/item';

const ArchiveList = (props) => {

  const { archiveItems } = props;

  return(
    <Section id="archive">
      <Group>
        <Item className="text no-margin-bottom">
          <p>Project Archive:</p>
        </Item>
        <Item className="line text no-margin-top">
          <p className="line" aria-hidden="true">----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------</p>
        </Item>
      </Group>

      {archiveItems.map(archiveItem => {
        return <ArchiveItem key={`archive-item-${archiveItem.id}`} data={archiveItem} />;
      })}
    </Section>
  );
}

ArchiveList.defaultProps = { archiveItems: [] };

export default ArchiveList;
