# Security and privacy

This server is designed for local, single-developer use. It does not store credentials on disk or transmit them to third-party services.

## Modes and security characteristics

Both modes are designed for **local single-developer use**. Docs mode has a zero credential surface. Full mode is effectively the same risk profile as your existing local SFCC workflow using `dw.json` for WebDAV + OCAPI access.

<table>
	<thead>
		<tr>
			<th>Mode</th>
			<th>Characteristics</th>
			<th>Risk profile</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Docs mode</td>
			<td>No auth, static docs, scaffolding only</td>
			<td>Minimal</td>
		</tr>
		<tr>
			<td>Full mode</td>
			<td>WebDAV + OCAPI credentials</td>
			<td>Same as local SFCC dev</td>
		</tr>
	</tbody>
</table>

<div class="vp-grid vp-grid--2" style="margin-top: 16px;">
	<div class="vp-card">
		<h3>Docs mode (default)</h3>
		<ul>
			<li>No credentials required</li>
			<li>Static docs + scaffolding only</li>
			<li>Safe for discovery and AI prompt prototyping</li>
		</ul>
	</div>
	<div class="vp-card">
		<h3>Full mode (<code>--dw-json</code>)</h3>
		<ul>
			<li>Uses the same credentials you already use locally</li>
			<li>WebDAV (logs + job logs) and OCAPI Data API tooling</li>
			<li>Capability-gated: tools only register if required credentials exist</li>
		</ul>
	</div>
</div>

## Baseline hardening checklist

<div class="vp-card">
	<ol>
		<li>Confirm sandbox hostname (never production domain).</li>
		<li>Add <code>dw.json</code> + <code>*.dw.json</code> to <code>.gitignore</code>.</li>
		<li>Use <code>chmod 600 dw.json</code> (owner read/write only).</li>
		<li>Remove unused OAuth fields if only using logs.</li>
		<li>Grant only required OCAPI resources (add incrementally).</li>
		<li>Use env vars to override secrets in CI contexts.</li>
		<li>Start in docs mode and validate tool surface.</li>
		<li>Rotate client secrets and passwords on a schedule.</li>
	</ol>
</div>

## Credential handling

<div class="vp-grid vp-grid--3">
	<div class="vp-card">
		<strong>Minimize scope:</strong> start with no Data API resources, add only what you need.
	</div>
	<div class="vp-card">
		<strong>Protect files:</strong> avoid synced/shared directories, never email secrets.
	</div>
	<div class="vp-card">
		<strong>Rotate & audit:</strong> remove orphaned API clients and track creation dates.
	</div>
</div>

## Threat model (local context)

<div class="vp-grid vp-grid--2">
	<div class="vp-card">
		<strong>Mitigated by design:</strong>
		<ul>
			<li>Path validation and schema checks</li>
			<li>Read-only log operations</li>
			<li>Scoped tool registration based on credentials</li>
			<li>Memory-only caching</li>
		</ul>
	</div>
	<div class="vp-card">
		<strong>Your responsibilities:</strong>
		<ul>
			<li>Do not run on shared multi-user servers</li>
			<li>Keep secrets out of version control</li>
			<li>Limit OCAPI resources to active feature work</li>
			<li>Rotate credentials regularly</li>
		</ul>
	</div>
</div>

## Data handling

- Log tools read a bounded tail of log files
- Site preference searches mask password values
- System object tools return metadata, not record data

## Reporting

If you discover a vulnerability, report it privately to the maintainers and avoid posting details in public issues.
