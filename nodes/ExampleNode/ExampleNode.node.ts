import { IExecuteFunctions } from 'n8n-core';
import {
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';



function checkJson(str: string) {
	try {
		const result = JSON.parse(str);
		return result;
	} catch (e) {
		return false;
	}
}


export class ExampleNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Usfm-Json Parser',
		name: 'usfmJsonParser',
		group: ['transform'],
		version: 1,
		description: 'Usfm Json Parser',
		defaults: {
			name: 'Usfm Json Parser',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.
			{
				displayName: 'Usfm or Json',
				name: 'usfmJson',
				type: 'string',
				default: '',
				placeholder: 'Input USFM or JSON here',
				description: 'Input USFM or JSON here',
			},
		],
	};


	// The function below is responsible for actually doing whatever this node
	// is supposed to do. In this case, we're just appending the `plainUSFM` property
	// with whatever the user has entered.
	// You can make async calls and use `await`.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();

		let item: INodeExecutionData;
		let usfmJson: string;

		// Iterates over all input items and add the key "plainUSFM" with the
		// value the parameter "plainUSFM" resolves to.
		// (This could be a different value for each item in case it contains an expression)
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				usfmJson = this.getNodeParameter('usfmJson', itemIndex, '') as string;
				item = items[itemIndex];
				const usfm = require('usfm-js');
				const isJson = checkJson(usfmJson);
				const result = isJson ? await usfm.toUSFM(isJson, { forcedNewLines: true }) : await usfm.toJSON(usfmJson);
				item.json['result'] = result;
			} catch (error) {
				// This node should never fail but we want to showcase how
				// to handle errors.
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					// Adding `itemIndex` allows other workflows to handle this error
					if (error.context) {
						// If the error thrown already contains the context property,
						// only append the itemIndex
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return this.prepareOutputData(items);
	}
}
