import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class HttpBinApi implements ICredentialType {
	displayName = 'HttpBin API';
	name = 'httpbinApi';
	documentationUrl = 'https://hjm.bid/auth/docs';
	properties: INodeProperties[] = [
		{
			displayName: 'Token',
			name: 'token',
			type: 'string',
			default: '',
		},
		{
			displayName: 'hjm.bid',
			name: 'domain',
			type: 'string',
			default: 'https://hjm.bid',
		},
	];

	// This allows the credential to be used by other parts of n8n
	// stating how this credential is injected as part of the request
	// An example is the Http Request node that can make generic calls
	// reusing this credential
	// authenticate: IAuthenticateGeneric = {
	// 	type: 'generic',
	// 	properties: {
	// 		headers: {
	// 			Authorization: '={{"Bearer " + $credentials.token}}',
	// 		},
	// 	},
	// };

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials?.domain}}',
			url: '/bearer',
		},
	};
}
