/**
 * Copyright (c) 2006-2013, JGraph Ltd
 * Converted to ES9 syntax/React by David Morrissey 2021
 */

import React from 'react';
import mxGraph from '../../mxgraph/view/graph/mxGraph';
import mxConstants from '../../mxgraph/util/mxConstants';
import mxCylinder from '../../mxgraph/shape/node/mxCylinder';
import mxCellRenderer from '../../mxgraph/view/cell/mxCellRenderer';

class Shape extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // A container for the graph
    return (
      <>
        <h1>Shape</h1>
        This example demonstrates how to implement and use a custom shape.
        <div
          ref={el => {
            this.el = el;
          }}
          style={{
            overflow: 'hidden',
            height: '241px',
            background: "url('editors/images/grid.gif')",
          }}
        />
      </>
    );
  }

  componentDidMount() {
    /*
      The example shape is a "3D box" that looks like this:
                   ____
                  /   /|
                 /___/ |
                 |   | /
                 |___|/

         The code below defines the shape. The BoxShape function
         it the constructor which creates a new object instance.
         
         The next lines use an mxCylinder instance to augment the
         prototype of the shape ("inheritance") and reset the
         constructor to the topmost function of the c'tor chain.
    */

    class BoxShape extends mxCylinder {
      // Defines the extrusion of the box as a "static class variable"
      extrude = 10;

      /*
           Next, the mxCylinder's redrawPath method is "overridden".
           This method has a isForeground argument to separate two
           paths, one for the background (which must be closed and
           might be filled) and one for the foreground, which is
           just a stroke.

           Foreground:       /
                       _____/
                            |
                            |
                         ____
           Background:  /    |
                       /     |
                       |     /
                       |____/
      */
      redrawPath(path, x, y, w, h, isForeground) {
        const dy = this.extrude * this.scale;
        const dx = this.extrude * this.scale;

        if (isForeground) {
          path.moveTo(0, dy);
          path.lineTo(w - dx, dy);
          path.lineTo(w, 0);
          path.moveTo(w - dx, dy);
          path.lineTo(w - dx, h);
        } else {
          path.moveTo(0, dy);
          path.lineTo(dx, 0);
          path.lineTo(w, 0);
          path.lineTo(w, h - dy);
          path.lineTo(w - dx, h);
          path.lineTo(0, h);
          path.lineTo(0, dy);
          path.lineTo(dx, 0);
          path.close();
        }
      }
    }
    mxCellRenderer.registerShape('box', BoxShape);

    // Creates the graph inside the DOM node.
    const graph = new mxGraph(this.el);

    // Disables basic selection and cell handling
    graph.setEnabled(false);

    // Changes the default style for vertices "in-place"
    // to use the custom shape.
    const style = graph.getStylesheet().getDefaultVertexStyle();
    style[mxConstants.STYLE_SHAPE] = 'box';

    // Adds a spacing for the label that matches the
    // extrusion size
    style[mxConstants.STYLE_SPACING_TOP] = BoxShape.prototype.extrude;
    style[mxConstants.STYLE_SPACING_RIGHT] = BoxShape.prototype.extrude;

    // Adds a gradient and shadow to improve the user experience
    style[mxConstants.STYLE_GRADIENTCOLOR] = '#FFFFFF';
    style[mxConstants.STYLE_SHADOW] = true;

    // Gets the default parent for inserting new cells. This
    // is normally the first child of the root (ie. layer 0).
    const parent = graph.getDefaultParent();

    // Adds cells to the model in a single step
    graph.getModel().beginUpdate();
    try {
      const v1 = graph.insertVertex(parent, null, 'Custom', 20, 20, 80, 60);
      const v2 = graph.insertVertex(parent, null, 'Shape', 200, 150, 80, 60);
      const e1 = graph.insertEdge(parent, null, '', v1, v2);
    } finally {
      // Updates the display
      graph.getModel().endUpdate();
    }
  }
}

export default Shape;
