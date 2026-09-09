/**
 * Questions for:
 * 1. Cybersecurity & InfoSec (Web Security, Network Security, Cryptography)
 * 2. Mobile App Development (React Native, Flutter, Android Native Kotlin, iOS Native Swift)
 * 3. Data Engineering & Big Data (Apache Spark, Kafka Streaming, Data Warehousing Snowflake/BigQuery)
 * Total: 10 Sub-types x 30 Questions = 300 Questions
 */

const newDomainsQuestions1 = {
  // -------------------------------------------------------------
  // 1. WEB SECURITY & OWASP TOP 10 (30 Questions)
  // -------------------------------------------------------------
  web_security: [
    {
      id: 'sec-web-1',
      q: 'What is SQL Injection (SQLi) and how do Parameterized Queries (Prepared Statements) prevent it?',
      a: 'SQL Injection occurs when untrusted user input is directly concatenated into dynamic SQL queries, allowing an attacker to manipulate query structure and execute arbitrary SQL commands. Prepared statements prevent SQLi by pre-compiling the SQL query structure in the database engine and treating user inputs strictly as typed parameters (placeholders like ? or $1), ensuring input is never executed as executable SQL syntax.'
    },
    {
      id: 'sec-web-2',
      q: 'Explain Cross-Site Scripting (XSS): Stored, Reflected, and DOM-based.',
      a: 'XSS allows attackers to inject malicious scripts into trusted websites. Stored XSS: malicious script is permanently saved on the target server (in DB/comments) and served to all victims. Reflected XSS: script is embedded in a malicious link or URL parameter and reflected back in the immediate server response. DOM-based XSS: vulnerability exists entirely in client-side code where unsafe JavaScript sources (location.search) are written to sinks (innerHTML, eval()) without hitting the server.'
    },
    {
      id: 'sec-web-3',
      q: 'What is Cross-Site Request Forgery (CSRF) and how do SameSite cookies and Anti-CSRF tokens defend against it?',
      a: 'CSRF tricks an authenticated victim browser into sending unauthorized requests to a vulnerable application where the user is already logged in (relying on automatic cookie submission). Anti-CSRF tokens defend against this by requiring a secret, unpredictable, cryptographically random token in request bodies/headers that attackers cannot forge. SameSite=Strict/Lax cookies prevent the browser from attaching session cookies to cross-site requests.'
    },
    {
      id: 'sec-web-4',
      q: 'What is Server-Side Request Forgery (SSRF) and how do attackers exploit cloud metadata endpoints?',
      a: 'SSRF occurs when a web application fetches a remote resource based on user-supplied URLs without proper validation, allowing attackers to coerce the server into sending requests to internal resources. In cloud environments (AWS, GCP), attackers query internal metadata endpoints (http://169.254.169.254/latest/meta-data/iam/security-credentials/) to steal IAM credentials. Mitigation includes URL whitelisting, disabling internal routing, and enforcing IMDSv2 with session tokens.'
    },
    {
      id: 'sec-web-5',
      q: 'Explain Content Security Policy (CSP) and how Nonces and Hashes enforce strict script execution.',
      a: 'CSP is an HTTP header (Content-Security-Policy) that restricts sources of scripts, styles, and media the browser is allowed to execute. Strict CSP disallows inline scripts (unsafe-inline). Nonce-based CSP generates a cryptographically random token per HTTP request (script-src \'nonce-r@nd0m\') that must match the HTML script tag (<script nonce="...">). Hash-based CSP (sha256-...) allows only scripts whose cryptographic hash matches the whitelist.'
    },
    {
      id: 'sec-web-6',
      q: 'What is Broken Object Level Authorization (BOLA / IDOR) and how should it be mitigated in REST APIs?',
      a: 'Insecure Direct Object Reference (IDOR / BOLA) happens when an API endpoint uses user-supplied IDs (e.g. GET /api/documents/1234) without verifying whether the authenticated user has permission to access that specific object. Mitigation requires fine-grained authorization checks at the service layer: verifying that currentSession.userId === document.ownerId before returning data, or using unguessable UUIDs combined with authorization middleware.'
    },
    {
      id: 'sec-web-7',
      q: 'What are HTTP Security Headers (HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)?',
      a: 'HSTS (Strict-Transport-Security) forces browsers to communicate only over HTTPS for a specified max-age. X-Frame-Options: DENY prevents clickjacking by forbidding embedding in iframes. X-Content-Type-Options: nosniff prevents MIME-type sniffing exploits. Referrer-Policy controls how much referrer information is leaked in outbound links.'
    },
    {
      id: 'sec-web-8',
      q: 'What is Clickjacking and how does Frame Busting or CSP frame-ancestors protect against it?',
      a: 'Clickjacking deceives users into clicking an invisible or transparent iframe positioned over benign UI elements. CSP frame-ancestors \'none\' (or \'self\') instructs the browser not to allow the page to be framed inside any other website, superseding legacy X-Frame-Options headers.'
    },
    {
      id: 'sec-web-9',
      q: 'What is Cross-Origin Resource Sharing (CORS) and why is CORS NOT an application security barrier?',
      a: 'CORS is a browser-enforced mechanism using HTTP headers (Access-Control-Allow-Origin) to permit cross-origin HTTP requests. It is a client-side restriction to protect users from malicious scripts, not a backend firewall; attackers can bypass CORS entirely using curl, Postman, or server-to-server calls.'
    },
    {
      id: 'sec-web-10',
      q: 'How does secure Session Management work (HttpOnly, Secure, SameSite flags)?',
      a: 'Session cookies should always include: HttpOnly (prevents client-side JS from reading cookie, mitigating XSS token theft), Secure (ensures cookies are transmitted only over encrypted TLS/HTTPS connections), and SameSite=Lax or Strict (mitigates CSRF). Additionally, session IDs must be regenerated upon authentication to prevent Session Fixation.'
    },
    {
      id: 'sec-web-11',
      q: 'What is XML External Entity (XXE) Injection and how do you disable DTD parsing?',
      a: 'XXE occurs when XML parsers process user-supplied XML containing references to external entities. Attackers define <!ENTITY xxe SYSTEM "file:///etc/passwd"> to read local server files or perform internal port scanning. Mitigate by disabling external DTDs (DisallowDoctypeDecl = true) and disabling external general entities in parser configuration.'
    },
    {
      id: 'sec-web-12',
      q: 'What is Insecure Deserialization and how can it lead to Remote Code Execution (RCE)?',
      a: 'Deserialization reconstructs objects from data streams. Insecure deserialization occurs when untrusted data is deserialized by vulnerable libraries (Java serializable, Python pickle, PHP unserialize), triggering magic methods or "gadget chains" that execute arbitrary code. Mitigate by using pure JSON/Protobuf and avoiding executable object serialization.'
    },
    {
      id: 'sec-web-13',
      q: 'What is Server-Side Template Injection (SSTI) vs Client-Side Template Injection (CSTI)?',
      a: 'SSTI occurs when user input is concatenated directly into server-side template engines (Jinja2, Twig, Freemarker) instead of passed as data variables, allowing attackers to access template syntax (${7*7}) and execute Python/Java system commands (RCE). CSTI occurs in frontend frameworks (AngularJS v1) evaluating expressions in DOM.'
    },
    {
      id: 'sec-web-14',
      q: 'What is Directory Traversal / Path Traversal and how do you prevent dot-dot-slash (../) attacks?',
      a: 'Path traversal lets attackers access files outside the intended web directory by injecting sequences like ../../../etc/passwd. Mitigate by avoiding user-supplied file names directly in filesystem calls, using hardcoded index lookups, or validating canonical paths using Path.normalize() and verifying startsWith(baseDirectory).'
    },
    {
      id: 'sec-web-15',
      q: 'What is Mass Assignment vulnerability and how do DTOs / Whitelisting prevent it?',
      a: 'Mass assignment happens when frameworks automatically bind HTTP request payloads directly to database models (e.g. User.create(req.body)). An attacker includes isAdmin: true or role: "admin". Mitigate by using Data Transfer Objects (DTOs) or strict attribute whitelisting (param filtering) to accept only allowed fields.'
    },
    {
      id: 'sec-web-16',
      q: 'What is Rate Limiting and Credential Stuffing defense (reCAPTCHA, Fail2ban)?',
      a: 'Credential stuffing uses automated bots to test stolen credentials against login endpoints. Defenses: 1) IP-based and user-based Rate Limiting (Token Bucket). 2) CAPTCHA challenges upon suspicious behavior. 3) Multi-Factor Authentication (MFA). 4) Breached password checks (HaveIBeenPwned API) during password changes.'
    },
    {
      id: 'sec-web-17',
      q: 'What is Open Redirect vulnerability and how do you prevent phishing relays?',
      a: 'Open redirect occurs when an application accepts a user-controlled parameter (e.g. /login?next=http://evil.com) and redirects without validation. Attackers use trusted brand domains to redirect victims to phishing sites. Mitigate by using relative URLs only (must start with / and not //) or maintaining an explicit allowlist of redirect domains.'
    },
    {
      id: 'sec-web-18',
      q: 'What is Security Misconfiguration and how do you harden production servers?',
      a: 'Security misconfigurations include default passwords, enabled debug modes, verbose stack traces in error responses, unneeded open ports, and default directory listings. Harden by automating configuration management (Ansible/Terraform), disabling server banners (Server: Apache/nginx), and running automated CIS benchmark scanners.'
    },
    {
      id: 'sec-web-19',
      q: 'What is JSON Web Token (JWT) "None" algorithm attack and Key Confusion attack?',
      a: 'In "None" algorithm attack, attackers change JWT header to {"alg": "none"}, stripping the signature; vulnerable libraries accept it without validation. In Key Confusion (HMAC vs RSA), attackers change an RS256 token to HS256 and sign it using the server\'s public key as the HMAC secret key. Mitigate by explicitly locking down allowed algorithms in verification methods.'
    },
    {
      id: 'sec-web-20',
      q: 'What is Command Injection and how does exec() differ from execFile() or spawn()?',
      a: 'Command injection occurs when untrusted input is passed to an operating system shell (e.g. system("ping " + ip)). Shell characters (; | & `) execute secondary commands. exec() passes strings through the system shell (/bin/sh). execFile() and spawn() execute the binary directly with arguments passed as an array of strings, bypassing shell interpretation entirely.'
    },
    {
      id: 'sec-web-21',
      q: 'What is HTTP Parameter Pollution (HPP) and how do servers handle duplicate parameters?',
      a: 'HPP occurs when attackers inject duplicate HTTP parameters (e.g. ?id=1&id=2). Different backend technologies handle duplicates differently (PHP takes the last; ASP.NET concatenates with comma; Node/Express creates an array). Attackers exploit discrepancies between WAFs and backend servers to bypass security filters.'
    },
    {
      id: 'sec-web-22',
      q: 'Explain Subdomain Takeover and Dangling DNS records.',
      a: 'Subdomain takeover happens when a DNS CNAME record points to an external third-party service (AWS S3, GitHub Pages, Heroku) that has been deleted or unclaimed. An attacker creates an account on that service and claims the dangling resource, gaining full control over the trusted organization subdomain.'
    },
    {
      id: 'sec-web-23',
      q: 'What is GraphQL Introspection and why should it be disabled in production?',
      a: 'GraphQL introspection (__schema, __type) returns the complete schema, queries, mutations, types, and fields of the GraphQL API. While useful in development, in production it exposes the entire internal architecture and hidden admin mutations to attackers. It should be disabled in production environments.'
    },
    {
      id: 'sec-web-24',
      q: 'What is Prototype Pollution in JavaScript and how does it compromise Node.js apps?',
      a: 'Prototype Pollution occurs when recursive merge or clone utilities allow modification of Object.prototype via properties like __proto__ or constructor.prototype. Attackers inject properties that affect all objects in the application, leading to bypass of security checks or Remote Code Execution via gadgets.'
    },
    {
      id: 'sec-web-25',
      q: 'What is Web Application Firewall (WAF) and what are its capabilities and limitations?',
      a: 'A WAF inspects HTTP/S traffic at layer 7, filtering out known attack signatures (SQLi, XSS, malicious user agents). Capabilities: protects legacy unpatched systems and stops automated script kiddie bots. Limitations: prone to evasion techniques (encoding tricks, HPP) and cannot detect business logic flaws.'
    },
    {
      id: 'sec-web-26',
      q: 'What is HTTP Request Smuggling and how do CL.TE and TE.CL discrepancies cause it?',
      a: 'Request smuggling occurs when frontend reverse proxies and backend servers disagree on request boundaries using Content-Length (CL) and Transfer-Encoding (TE) headers. A crafted request causes part of request A to be interpreted as the prefix of request B, allowing cache poisoning, credential hijacking, and request interception.'
    },
    {
      id: 'sec-web-27',
      q: 'What is Cross-Site Script Inclusion (XSSI) and JSON Hijacking?',
      a: 'XSSI exploits the fact that the HTML <script> tag is exempt from Same-Origin Policy. If an API returns sensitive user JSON arrays directly via GET, a malicious third-party site can include the API endpoint in a <script src="..."> tag and override the Array constructor to steal confidential data.'
    },
    {
      id: 'sec-web-28',
      q: 'What is Subresource Integrity (SRI) in HTML?',
      a: 'SRI (<script src="..." integrity="sha384-..." crossorigin="anonymous">) allows browsers to verify that resources fetched from third-party CDNs have not been maliciously modified or compromised. If the cryptographic hash does not match, the browser refuses to execute the script.'
    },
    {
      id: 'sec-web-29',
      q: 'What is Race Condition / Time-of-Check to Time-of-Use (TOCTOU) in web apps?',
      a: 'TOCTOU happens when a system checks a state (e.g. checking if coupon code was used or balance > $10) and then performs an action based on that state, but concurrent requests execute between the check and use, allowing duplicate withdrawals or applying single-use coupons multiple times. Mitigate with atomic DB transactions and distributed locks.'
    },
    {
      id: 'sec-web-30',
      q: 'What is Security Logging and Monitoring failure (OWASP A09) and how does SIEM help?',
      a: 'Without centralized logging and alerting, malicious activities go undetected for months. SIEM (Security Information and Event Management, e.g. Splunk, Datadog) aggregates audit trails, authentication failures, access control denials, and anomalous spikes, triggering automated incident response alerts.'
    }
  ],

  // -------------------------------------------------------------
  // 2. NETWORK SECURITY & PENETRATION TESTING (30 Questions)
  // -------------------------------------------------------------
  network_security: [
    {
      id: 'sec-net-1',
      q: 'What is the OSI Model and at which layers do Firewalls, Routers, and Switches operate?',
      a: 'The OSI model has 7 layers: 1-Physical, 2-Data Link (Switches / MAC), 3-Network (Routers / IP), 4-Transport (TCP/UDP, Statefull Firewalls), 5-Session, 6-Presentation, 7-Application (Next-Gen Firewalls, WAFs, Proxies). Traditional packet filters operate at Layer 3/4; modern Next-Generation Firewalls (NGFW) inspect payloads up to Layer 7.'
    },
    {
      id: 'sec-net-2',
      q: 'What is TCP 3-Way Handshake and how does a SYN Flood DDoS attack exploit it?',
      a: 'Handshake: 1) Client sends SYN. 2) Server responds SYN-ACK and allocates memory in backlog queue. 3) Client sends ACK. In a SYN Flood attack, attackers send thousands of spoofed SYN packets without sending the final ACK, filling the server’s SYN backlog table until legitimate connections are dropped. Defenses: SYN Cookies and rate limiting.'
    },
    {
      id: 'sec-net-3',
      q: 'What is Man-in-the-Middle (MitM) Attack and ARP Spoofing / Poisoning?',
      a: 'MitM intercepts communications between two parties. ARP Spoofing sends falsified ARP messages across a local LAN to link the attacker’s MAC address with the IP address of a legitimate default gateway. All traffic destined for the gateway passes through the attacker first. Defenses: Dynamic ARP Inspection (DAI) on managed switches and 802.1X network access control.'
    },
    {
      id: 'sec-net-4',
      q: 'Explain DNS Spoofing / DNS Cache Poisoning and DNSSEC.',
      a: 'DNS cache poisoning injects false DNS records into a recursive DNS resolver cache, redirecting users visiting bank.com to a malicious phishing server. DNSSEC (DNS Security Extensions) signs DNS records using public key cryptography, enabling resolvers to verify record authenticity and cryptographic integrity.'
    },
    {
      id: 'sec-net-5',
      q: 'What is the difference between Stateful vs Stateless Packet Inspection firewalls?',
      a: 'Stateless firewalls evaluate packets individually against static access lists (source/dest IP and port) without tracking conversation state. Stateful firewalls track connection state in a state table (SYN, ESTABLISHED, FIN); return traffic belonging to an established outbound connection is automatically permitted, preventing spoofed incoming packets.'
    },
    {
      id: 'sec-net-6',
      q: 'What is Nmap and what is the difference between TCP SYN Scan (-sS) and TCP Connect Scan (-sT)?',
      a: 'Nmap is a network scanner. TCP Connect Scan (-sT) completes the full 3-way handshake using the OS network stack, which is logged by target application servers. TCP SYN Scan (-sS, stealth scan) sends a SYN; if SYN-ACK is returned, port is open and Nmap sends RST immediately without completing handshake, evading simple connection logs.'
    },
    {
      id: 'sec-net-7',
      q: 'What is Port Scanning and what do Open, Closed, and Filtered port statuses mean in Nmap?',
      a: 'Open: an application is actively listening and accepting connections on the port. Closed: packet reached port, but no application is listening (target returns TCP RST or ICMP unreachable). Filtered: packets are dropped or blocked by a firewall, preventing Nmap from determining whether the port is open or closed.'
    },
    {
      id: 'sec-net-8',
      q: 'What is a Distributed Denial of Service (DDoS) Amplification attack (NTP, DNS)?',
      a: 'Amplification attacks exploit UDP protocols that return responses significantly larger than queries. Attackers send requests with spoofed victim IP addresses to open reflectors (DNS resolvers or NTP servers with monlist command enabled). A small 50-byte query generates a 4000-byte response reflected onto the victim, saturating network pipes.'
    },
    {
      id: 'sec-net-9',
      q: 'What is IDS (Intrusion Detection System) vs IPS (Intrusion Prevention System)?',
      a: 'IDS is passive: it monitors mirrored network traffic (TAP/SPAN port), analyzes packets against signature databases or behavioral anomalies, and alerts administrators without interfering with traffic. IPS is active/inline: it sits in the direct network path and actively drops packets or terminates connections when malicious activity is detected (Snort, Suricata).'
    },
    {
      id: 'sec-net-10',
      q: 'What is a Virtual Private Network (VPN) and how does IPsec differ from WireGuard and OpenVPN?',
      a: 'VPNs create encrypted network tunnels. IPsec operates at Layer 3 (Network), supports AH and ESP protocols, and is standard for site-to-site tunnels. OpenVPN operates in user space using OpenSSL over TCP/UDP with SSL/TLS. WireGuard is modern, lean (~4,000 lines of code in Linux kernel), using state-of-the-art cryptography (ChaCha20-Poly1305) with superior throughput and low latency.'
    },
    {
      id: 'sec-net-11',
      q: 'What is Zero Trust Network Architecture (ZTNA) and "Never Trust, Always Verify"?',
      a: 'Traditional perimeter security trusts everything inside the corporate network. Zero Trust assumes the internal network is already compromised: every access request (user, device, location) must be authenticated, authorized, and continuously validated before granting least-privilege micro-segmented access to applications.'
    },
    {
      id: 'sec-net-12',
      q: 'What is Network Segmentation and Microsegmentation in modern datacenters?',
      a: 'Network segmentation divides a network into smaller subnets via VLANs and firewalls. Microsegmentation isolates workloads down to individual container/VM levels (using host-level firewalls or service mesh eBPF/mTLS), preventing lateral movement of attackers across east-west traffic.'
    },
    {
      id: 'sec-net-13',
      q: 'What is BGP Hijacking and RPKI (Resource Public Key Infrastructure)?',
      a: 'Border Gateway Protocol (BGP) routes Internet traffic between Autonomous Systems (AS). Attackers announce false IP prefix ownership, intercepting or blackholing global traffic destined for target organizations. RPKI uses cryptographic certificates to validate that an AS is legitimately authorized to announce specific IP address prefixes.'
    },
    {
      id: 'sec-net-14',
      q: 'What is Wireshark and how do you analyze packet captures (PCAP) for suspicious activity?',
      a: 'Wireshark is a packet analyzer. Security analysts filter traffic (e.g. http.request.method == "POST", dns.flags.response == 1), inspect payload hex bytes, follow TCP streams to reconstruct sessions, and identify anomalies like cleartext credentials, port scans, beaconing malware, or DNS data exfiltration.'
    },
    {
      id: 'sec-net-15',
      q: 'What is Lateral Movement in penetration testing and how do Pass-the-Hash and Kerberoasting work?',
      a: 'Lateral movement is moving through a compromised network to find high-value targets. Pass-the-Hash: attacker extracts NTLM hash from LSASS memory and uses it to authenticate to remote SMB/RDP servers without cracking the plaintext password. Kerberoasting: attacker requests Kerberos TGS service tickets for SPNs and cracks service account passwords offline.'
    },
    {
      id: 'sec-net-16',
      q: 'What is Privilege Escalation (Vertical vs Horizontal)?',
      a: 'Horizontal: attacker gains access to another user account with identical permission levels (e.g. accessing another customer’s account). Vertical: attacker escalates from low-privileged user (standard domain user or www-data) to administrative superuser (root or Windows SYSTEM/Domain Admin).'
    },
    {
      id: 'sec-net-17',
      q: 'What is a Honeypot and Honeytoken in defensive deception security?',
      a: 'A Honeypot is a decoy system with no legitimate business purpose, intentionally exposed to attract and analyze attacker behavior. A Honeytoken is fake data (decoy AWS access keys or DB records); any attempt to use or access the honeytoken immediately triggers high-priority security alarms.'
    },
    {
      id: 'sec-net-18',
      q: 'What is Metasploit Framework and what are Payloads, Exploits, and Auxiliary modules?',
      a: 'Metasploit is an open-source penetration testing platform. An Exploit takes advantage of a specific vulnerability to gain access. A Payload is the malicious code executed after successful exploitation (e.g. Meterpreter reverse shell). Auxiliary modules perform scanning, sniffing, fuzzing, and reconnaissance.'
    },
    {
      id: 'sec-net-19',
      q: 'What is a Reverse Shell vs Bind Shell?',
      a: 'Bind Shell: attacker launches a listener shell on a specific port on the target machine and connects directly to it (often blocked by target inbound firewalls). Reverse Shell: target machine connects outbound back to the attacker’s listening machine (often permitted because firewalls allow outbound connections).'
    },
    {
      id: 'sec-net-20',
      q: 'What is DNS Tunneling and how do attackers exfiltrate data over port 53?',
      a: 'Attackers encode sensitive data into subdomains of a controlled domain (e.g. sensitive_creditcard_data.evil.com) and query DNS. Because port 53 (DNS) is rarely blocked by corporate egress firewalls, the query reaches the attacker’s authoritative nameserver, exfiltrating data covertly.'
    },
    {
      id: 'sec-net-21',
      q: 'What is DMZ (Demilitarized Zone) in network architecture?',
      a: 'A DMZ is a physical or logical subnet that separates an internal private local area network (LAN) from untrusted external networks (Internet). External-facing servers (web servers, mail servers) reside in the DMZ so that if compromised, the internal LAN remains protected behind an interior firewall.'
    },
    {
      id: 'sec-net-22',
      q: 'What is 802.1X and Network Access Control (NAC)?',
      a: 'IEEE 802.1X is an enterprise port-based Network Access Control protocol. Devices connecting via Ethernet or Wi-Fi must authenticate with a central RADIUS server (using EAP-TLS with certificates) before the network switch unblocks the port, preventing rogue laptops from joining corporate networks.'
    },
    {
      id: 'sec-net-23',
      q: 'What is VLAN Hopping (Switch Spoofing vs Double Tagging)?',
      a: 'VLAN hopping enables traffic from one VLAN to be seen by another VLAN. Switch spoofing: rogue host negotiates trunk link via DTP (Dynamic Trunking Protocol). Double tagging: attacker prepends two 802.1Q tags; first switch strips the outer tag, and the next switch forwards the frame to the target victim VLAN.'
    },
    {
      id: 'sec-net-24',
      q: 'What is Web Proxy Auto-Discovery (WPAD) and LLMNR/NBT-NS Poisoning (Responder)?',
      a: 'When Windows fails to resolve hostnames via DNS, it falls back to multicast LLMNR and NetBIOS broadcast queries. An attacker running Responder answers these broadcast requests, tricking victim computers into sending NTLMv2 challenge-response hashes, which are captured and cracked offline.'
    },
    {
      id: 'sec-net-25',
      q: 'What is Egress Filtering and why is it as critical as Ingress Filtering?',
      a: 'Ingress filtering monitors traffic entering the network. Egress filtering monitors and restricts outbound traffic leaving the internal network. Strict egress filtering stops malware from establishing Command & Control (C2) reverse shells, blocks data exfiltration, and halts botnet spreading.'
    },
    {
      id: 'sec-net-26',
      q: 'What is Red Teaming vs Penetration Testing vs Vulnerability Assessment?',
      a: 'Vulnerability assessment scans and inventories known vulnerabilities. Penetration testing exploits specific vulnerabilities to assess severity within defined scope. Red Teaming simulates real-world adversary attack scenarios (including social engineering, physical security, stealth, and evasion) to test blue team detection and response capabilities.'
    },
    {
      id: 'sec-net-27',
      q: 'What is Bastion Host / Jump Server and how do you secure SSH access?',
      a: 'A Bastion Host is a hardened server that serves as the single secure entry point into a private network. Secure SSH by disabling password authentication (enforcing SSH public key / FIDO2 keys only), changing default port, enforcing MFA, disabling root login, and applying fail2ban.'
    },
    {
      id: 'sec-net-28',
      q: 'What is Wi-Fi Security: WPA2 vs WPA3 and KRACK attack?',
      a: 'WPA2 uses 4-way handshake, vulnerable to KRACK (Key Reinstallation Attack) and offline dictionary attacks via captured handshakes. WPA3 replaces PSK with SAE (Simultaneous Authentication of Equals / Dragonfly handshake), providing forward secrecy and resistance to offline dictionary attacks.'
    },
    {
      id: 'sec-net-29',
      q: 'What is Deep Packet Inspection (DPI) and how does TLS 1.3 impact it?',
      a: 'DPI inspects packet payloads (Layer 7) for malware signatures and protocol compliance. TLS 1.3 encrypts handshakes and extensions (Encrypted Client Hello - ECH), blinding traditional DPI firewalls unless SSL decryption / forward proxies with enterprise root certificates are deployed.'
    },
    {
      id: 'sec-net-30',
      q: 'What is Common Vulnerabilities and Exposures (CVE) and Common Vulnerability Scoring System (CVSS)?',
      a: 'CVE is a dictionary of publicly known cybersecurity vulnerabilities (e.g. CVE-2021-44228 Log4Shell). CVSS scores severity from 0.0 to 10.0 based on Attack Vector, Complexity, Privileges Required, User Interaction, and CIA impact (Confidentiality, Integrity, Availability).'
    }
  ],

  // -------------------------------------------------------------
  // 3. CRYPTOGRAPHY & SECOPS (30 Questions)
  // -------------------------------------------------------------
  cryptography: [
    {
      id: 'sec-crypto-1',
      q: 'What is the difference between Symmetric and Asymmetric Encryption?',
      a: 'Symmetric encryption uses a single shared secret key for both encryption and decryption (fast, suitable for bulk data; examples: AES-256, ChaCha20). Asymmetric encryption uses a mathematically linked key pair: a public key for encryption and a private key for decryption (slower, used for key exchange and digital signatures; examples: RSA, ECC).'
    },
    {
      id: 'sec-crypto-2',
      q: 'How does Diffie-Hellman Key Exchange work and what is Ephemeral Diffie-Hellman (DHE / ECDHE)?',
      a: 'Diffie-Hellman allows two parties to establish a shared secret over an insecure channel without transmitting the secret itself, based on discrete logarithm difficulty. Ephemeral Diffie-Hellman (ECDHE) generates a temporary, unique key pair per session, providing Perfect Forward Secrecy (past traffic cannot be decrypted if server private key is leaked later).'
    },
    {
      id: 'sec-crypto-3',
      q: 'What is Perfect Forward Secrecy (PFS) in TLS connections?',
      a: 'PFS guarantees that the compromise of a server’s long-term private key does not compromise past encrypted session keys. Even if an adversary records encrypted network traffic for years, they cannot decrypt recorded historical sessions because session keys were generated ephemerally via ECDHE.'
    },
    {
      id: 'sec-crypto-4',
      q: 'What is the difference between Hashing, Encryption, and Encoding?',
      a: 'Hashing is a one-way deterministic mathematical function (SHA-256, bcrypt) producing a fixed-size digest; it cannot be reversed. Encryption is a two-way function transforming plaintext into ciphertext using a key, reversible only with the corresponding key. Encoding (Base64, ASCII) transforms data formats for safe transmission; it provides zero confidentiality.'
    },
    {
      id: 'sec-crypto-5',
      q: 'Why is standard SHA-256 unsuitable for Password Storage and why are Argon2, bcrypt, and PBKDF2 used instead?',
      a: 'Fast cryptographic hashes like SHA-256 are designed for speed (hashing gigabytes per second), enabling modern GPUs and ASICs to compute billions of guesses per second during brute-force attacks. Password hashing algorithms (Argon2id, bcrypt, PBKDF2) are intentionally computationally expensive and memory-hard, with configurable work factors (cost) to thwart GPU parallelization.'
    },
    {
      id: 'sec-crypto-6',
      q: 'What is Salt and Pepper in password hashing?',
      a: 'A Salt is a unique, cryptographically random string generated per user and stored alongside the password hash in the DB; it prevents Rainbow Table attacks and ensures identical passwords yield different hashes. A Pepper is a secret key stored separately outside the database (in HSM or KMS) and combined with passwords before hashing.'
    },
    {
      id: 'sec-crypto-7',
      q: 'What is Public Key Infrastructure (PKI) and how does Certificate Authority (CA) validation work?',
      a: 'PKI manages digital certificates and public-key encryption. A Certificate Authority (CA, e.g. Let\'s Encrypt) cryptographically signs a server’s digital certificate (X.509) containing its public key. Browsers verify the digital signature using root CA certificates pre-installed in the OS root store.'
    },
    {
      id: 'sec-crypto-8',
      q: 'What is AES-GCM and why is Authenticated Encryption with Associated Data (AEAD) superior to AES-CBC?',
      a: 'AES-CBC provides confidentiality but no cryptographic integrity, vulnerable to Padding Oracle attacks. AES-GCM (Galois/Counter Mode) is an AEAD cipher that provides both confidentiality and tamper-proof message integrity in a single pass. If ciphertext or associated data is altered by even one bit, decryption immediately fails.'
    },
    {
      id: 'sec-crypto-9',
      q: 'What is an Initialization Vector (IV) and why must it NEVER be reused in AES-GCM?',
      a: 'An IV provides entropy to ensure encrypting identical plaintext multiple times produces completely different ciphertexts. In AES-GCM, reusing an IV with the same key destroys the authentication tag security (catastrophic nonce-reuse attack), allowing attackers to forge messages and recover plaintext.'
    },
    {
      id: 'sec-crypto-10',
      q: 'What is Certificate Pinning and why has it fallen out of favor in web browsers?',
      a: 'Certificate Pinning hardcodes the expected server certificate or public key hash directly in client applications, rejecting even legitimate CA-signed certificates. While popular in mobile apps to stop MitM, it fell out of favor because certificate rotations or compromised keys risk bricking mobile apps globally.'
    },
    {
      id: 'sec-crypto-11',
      q: 'What is Elliptic Curve Cryptography (ECC) vs RSA and why is ECC preferred today?',
      a: 'ECC achieves equivalent cryptographic security to RSA with significantly smaller key sizes (a 256-bit ECC key equals a 3072-bit RSA key). Smaller keys require less memory, consume less CPU during handshakes, reduce network packet overhead, and are ideal for mobile and IoT devices.'
    },
    {
      id: 'sec-crypto-12',
      q: 'What is Digital Signature (ECDSA, Ed25519) and how does it guarantee Non-Repudiation?',
      a: 'A digital signature hashes a message and encrypts the hash using the sender’s private key. Anyone with the sender’s public key can verify the signature. Because only the private key owner could have produced the signature, it guarantees Authenticity, Integrity, and Non-Repudiation (sender cannot deny signing it).'
    },
    {
      id: 'sec-crypto-13',
      q: 'What is HMAC (Hash-based Message Authentication Code)?',
      a: 'HMAC (e.g. HMAC-SHA256) calculates a message authentication code by combining a cryptographic hash function with a shared secret key: HMAC(K, m) = H((K ^ opad) || H((K ^ ipad) || m)). It guarantees that the message has not been tampered with and was sent by a party possessing the secret key.'
    },
    {
      id: 'sec-crypto-14',
      q: 'What is Hardware Security Module (HSM) and AWS KMS / CloudHSM?',
      a: 'An HSM is a tamper-resistant physical computing device that securely generates, stores, and manages cryptographic keys. Keys never leave the cryptographic boundary in plaintext: encryption, decryption, and signing operations execute directly inside the secure hardware chip.'
    },
    {
      id: 'sec-crypto-15',
      q: 'What is Quantum Computing threat to modern cryptography and Post-Quantum Cryptography (PQC)?',
      a: 'Shor’s Algorithm running on future fault-tolerant quantum computers will break RSA and ECC in polynomial time by solving discrete logarithms and prime factorizations. NIST is standardizing Post-Quantum Cryptography (PQC) based on lattice cryptography (ML-KEM / Kyber for key exchange, ML-DSA / Dilithium for signatures).'
    },
    {
      id: 'sec-crypto-16',
      q: 'What is Certificate Transparency (CT) and how do CT logs detect fraudulent SSL certificates?',
      a: 'CT is an open framework of append-only, cryptographically auditable Merkle tree logs. Whenever a CA issues an SSL certificate, it must submit it to public CT logs. Domain owners monitor CT logs to detect unauthorized or rogue certificates issued for their domains immediately.'
    },
    {
      id: 'sec-crypto-17',
      q: 'What is OCSP (Online Certificate Status Protocol) and OCSP Stapling?',
      a: 'OCSP checks if an SSL certificate has been revoked before expiration. In standard OCSP, the client queries the CA directly (leaking user browsing habits and slowing page loads). In OCSP Stapling, the web server periodically queries the CA and "staples" the CA\'s time-stamped, signed revocation response directly to the initial TLS handshake.'
    },
    {
      id: 'sec-crypto-18',
      q: 'What is Envelope Encryption?',
      a: 'Envelope encryption encrypts plaintext data with a unique Data Encryption Key (DEK). The DEK is then encrypted with a top-level Key Encryption Key (KEK / Root Key) managed in KMS and stored alongside the encrypted data. It avoids sending massive data payloads over the network to KMS.'
    },
    {
      id: 'sec-crypto-19',
      q: 'What is Timing Attack in cryptography and how do Constant-Time comparisons prevent it?',
      a: 'A timing attack measures small differences in execution time (e.g. string comparison breaking on first mismatched character). Attackers deduce secret keys or tokens character-by-character. Constant-time comparison (crypto.timingSafeEqual in Node.js) always checks all characters regardless of mismatches, ensuring constant execution time.'
    },
    {
      id: 'sec-crypto-20',
      q: 'What is Zero-Knowledge Proof (ZKP) and zk-SNARKs?',
      a: 'A Zero-Knowledge Proof allows a Prover to prove to a Verifier that a statement is true without revealing any secret information beyond the validity of the statement itself (e.g. proving you are over 21 without revealing birthdate). zk-SNARKs enable succinct, non-interactive zero-knowledge verification in blockchain.'
    },
    {
      id: 'sec-crypto-21',
      q: 'What is SIEM, SOAR, and SOC in modern Security Operations?',
      a: 'SOC (Security Operations Center) is the team monitoring threats. SIEM (Security Information & Event Management) aggregates logs and detects security correlations. SOAR (Security Orchestration, Automation, and Response) automates incident response workflows (e.g. automatically quarantining a compromised host or blocking a malicious IP).'
    },
    {
      id: 'sec-crypto-22',
      q: 'What is the MITRE ATT&CK Framework and how is it used in threat modeling?',
      a: 'MITRE ATT&CK is a globally accessible curated knowledge base of adversary tactics, techniques, and procedures (TTPs) based on real-world cyberattacks. Security teams map their detection rules, log telemetry, and defense controls against the ATT&CK matrix to identify coverage gaps.'
    },
    {
      id: 'sec-crypto-23',
      q: 'What is Endpoint Detection and Response (EDR) vs Antivirus (AV)?',
      a: 'Legacy Antivirus relies on static file hash signatures to detect known malware. EDR (CrowdStrike, SentinelOne) continuously records endpoint telemetry, process executions, memory modifications, and network connections, using behavioral analysis to detect zero-day exploits, fileless malware, and living-off-the-land techniques.'
    },
    {
      id: 'sec-crypto-24',
      q: 'What is an Incident Response Plan (NIST 800-61 phases)?',
      a: 'NIST IR Phases: 1) Preparation (tools, training). 2) Detection & Analysis (identifying breaches and indicators of compromise). 3) Containment, Eradication & Recovery (isolating infected assets, removing malware, restoring from clean backups). 4) Post-Incident Activity (blameless lessons learned and improving defense controls).'
    },
    {
      id: 'sec-crypto-25',
      q: 'What is Data at Rest vs Data in Transit vs Data in Use encryption?',
      a: 'Data in Transit is encrypted over networks via TLS/mTLS. Data at Rest is encrypted in storage/databases using AES-256 (BitLocker, LUKS, KMS). Data in Use is encrypted while being processed in CPU and memory using Confidential Computing and secure hardware enclaves (Intel SGX, AMD SEV).'
    },
    {
      id: 'sec-crypto-26',
      q: 'What is Cryptographic Key Rotation and why is it mandatory in compliance (PCI-DSS, SOC 2)?',
      a: 'Key rotation regularly replaces cryptographic keys with newly generated keys (e.g. annually). It limits the volume of data encrypted under a single key (reducing the blast radius if a key is ever compromised) and invalidates old keys for future encryption.'
    },
    {
      id: 'sec-crypto-27',
      q: 'What is Homomorphic Encryption?',
      a: 'Homomorphic encryption allows computations to be performed directly on encrypted ciphertext without decrypting it first. The resulting computed ciphertext, when decrypted, matches the result of operations as if they were performed on plaintext, enabling secure cloud data processing without exposing private data.'
    },
    {
      id: 'sec-crypto-28',
      q: 'What is Ransomware defense and Immutable Backups (WORM storage)?',
      a: 'Ransomware encrypts corporate data and deletes backups. Defense relies on the 3-2-1 backup rule (3 copies, 2 different media, 1 offsite/cloud) combined with Immutable WORM (Write Once, Read Many) storage with S3 Object Lock in Compliance Mode, which prevents any user (including root/admins) from deleting or altering backups.'
    },
    {
      id: 'sec-crypto-29',
      q: 'What is Threat Intelligence and Indicators of Compromise (IoCs: IP, domain, file hashes)?',
      a: 'Threat intelligence collects data about emerging cyber threats and threat actor groups. Indicators of Compromise (IoCs) are forensic artifacts: malicious IP addresses, phishing domains, and SHA-256 malware file hashes. Organizations ingest automated IoC feeds (STIX/TAXII) to block malicious traffic proactively.'
    },
    {
      id: 'sec-crypto-30',
      q: 'What is DevSecOps and how are Security Gates integrated into CI/CD pipelines?',
      a: 'DevSecOps shifts security left by integrating automated security checks directly into developer workflows: 1) Pre-commit: secret scanning (TruffleHog). 2) PR build: Static Application Security Testing (SAST, SonarQube) and Software Composition Analysis (SCA, Snyk). 3) Staging: DAST (OWASP ZAP) and container image scanning.'
    }
  ],

  // -------------------------------------------------------------
  // 4. REACT NATIVE (30 Questions)
  // -------------------------------------------------------------
  react_native: [
    {
      id: 'rn-1',
      q: 'What is the New Architecture in React Native: Fabric, TurboModules, and JSI?',
      a: 'The legacy architecture relied on an asynchronous JSON bridge between JS and Native threads. The New Architecture replaces this with: 1) JSI (JavaScript Interface): allows C++ and JavaScript to communicate directly via shared memory pointers without JSON serialization. 2) Fabric: the new C++ rendering engine supporting synchronous UI layout measurements and React 18 concurrent features. 3) TurboModules: lazy-loads native modules only when requested.'
    },
    {
      id: 'rn-2',
      q: 'How does React Native bridge work in the legacy architecture and why is it a bottleneck?',
      a: 'The legacy bridge is an asynchronous, serialized JSON message queue connecting the JavaScript thread and the Native Main/UI thread. Every UI event, layout measurement, and native call must be converted to JSON strings, passed across the bridge, and deserialized, causing lag during fast user interactions (scrolling fast lists, dragging gestures).'
    },
    {
      id: 'rn-3',
      q: 'What is FlatList and how does it optimize memory compared to ScrollView in React Native?',
      a: 'ScrollView renders all child components simultaneously into memory at mount time, causing out-of-memory crashes on large datasets. FlatList is virtualized: it renders only items visible within the current viewport window plus a small buffer (windowSize), unmounting off-screen items to maintain constant memory consumption.'
    },
    {
      id: 'rn-4',
      q: 'What is Hermes JavaScript Engine and what benefits does it bring to React Native?',
      a: 'Hermes is an open-source JavaScript engine optimized by Meta specifically for mobile apps. Key benefits: 1) Ahead-of-Time (AOT) bytecode compilation during build time (eliminates runtime JS parsing). 2) Faster Time to Interactive (TTI). 3) Significantly lower memory footprint and smaller APK/IPA bundle size.'
    },
    {
      id: 'rn-5',
      q: 'How do you handle Gestures and Animations smoothly in React Native (react-native-reanimated)?',
      a: 'Using standard React state updates runs animations on the JavaScript thread at 20-30fps. Reanimated 2/3 uses "Worklets" (tiny JS functions compiled to execute directly on the UI/native thread), updating transform and opacity styles at 60/120fps without crossing the bridge, paired with react-native-gesture-handler.'
    },
    {
      id: 'rn-6',
      q: 'What is Expo and what are the differences between Expo Managed Workflow and Bare Workflow?',
      a: 'Expo is an open-source framework and platform for React Native. Managed workflow handles native builds, certificates, and updates in the cloud with zero Xcode/Android Studio configuration, using Config Plugins for custom native code. Bare workflow gives full direct access to android/ and ios/ native directories.'
    },
    {
      id: 'rn-7',
      q: 'What is EAS (Expo Application Services) and EAS Build & Submit?',
      a: 'EAS is a hosted cloud infrastructure for React Native. EAS Build compiles production iOS and Android binaries in cloud macOS and Linux containers. EAS Submit automatically deploys compiled binaries directly to Apple App Store TestFlight and Google Play Console track channels.'
    },
    {
      id: 'rn-8',
      q: 'How does Navigation work in React Native: React Navigation Stack vs Native Stack?',
      a: 'React Navigation Stack uses JavaScript-based animated views on top of the bridge. Native Stack (@react-navigation/native-stack) leverages native platform navigation primitives (UINavigationController on iOS and Fragment on Android), providing native screen transitions, hardware back button handling, and superior memory efficiency.'
    },
    {
      id: 'rn-9',
      q: 'What is Over-The-Air (OTA) Updates (Expo Updates / CodePush) and App Store compliance?',
      a: 'OTA updates allow developers to deploy JavaScript and asset updates directly to installed apps without waiting for Apple App Store or Google Play Store approval. Apple App Store guidelines allow OTA updates as long as the core functionality and nature of the app are not altered.'
    },
    {
      id: 'rn-10',
      q: 'How do you secure Sensitive Data (API keys, JWTs) on mobile in React Native?',
      a: 'Never store JWTs or tokens in AsyncStorage (it is unencrypted plaintext on disk). Use react-native-keychain or expo-secure-store, which store credentials inside hardware-backed secure storage: iOS Keychain and Android Keystore with AES-256 encryption.'
    },
    {
      id: 'rn-11',
      q: 'What is Deep Linking and Universal Links / App Links in React Native?',
      a: 'Deep links (myapp://profile/123) open specific screens inside an installed app. Universal Links (iOS) and App Links (Android) use verified HTTPS domain links (https://example.com/profile/123) backed by apple-app-site-association and assetlinks.json files to guarantee that links open your verified app without browser prompts.'
    },
    {
      id: 'rn-12',
      q: 'What is Yoga Layout Engine in React Native?',
      a: 'Yoga is an open-source C++ layout engine developed by Meta that implements the W3C Flexbox specification across cross-platform native environments. It computes exact pixel coordinates and dimensions on background threads for iOS, Android, and desktop.'
    },
    {
      id: 'rn-13',
      q: 'What causes Memory Leaks in React Native and how do you diagnose them using Flipper / React DevTools?',
      a: 'Leaks occur from uncleaned timers (setInterval), uncleared event listeners, retaining large closures in useEffect, or holding references to unmounted native views. Diagnose by profiling memory graphs in Flipper, inspecting the JS heap allocations, and taking native memory snapshots in Xcode/Android Studio.'
    },
    {
      id: 'rn-14',
      q: 'How does App State (AppState) work in React Native (active, background, inactive)?',
      a: 'AppState informs your app whether it is in the foreground (active), transitioning (inactive on iOS, during notifications or app switcher), or in the background (background). Apps listen to AppState.addEventListener(\'change\', handler) to pause animations, blur sensitive bank details, or sync data.'
    },
    {
      id: 'rn-15',
      q: 'How do you bridge a Custom Native Module (Objective-C/Swift for iOS, Java/Kotlin for Android) in React Native?',
      a: 'Android: create a class extending ReactContextBaseJavaModule, annotate methods with @ReactMethod, and register the package in MainApplication. iOS: create an Objective-C class implementing RCTBridgeModule, and export methods using RCT_EXPORT_METHOD(). In the New Architecture, TurboModules use Codegen and TypeScript specifications.'
    },
    {
      id: 'rn-16',
      q: 'What is KeyboardAvoidingView and how do you handle keyboard dismissal smoothly?',
      a: 'KeyboardAvoidingView automatically adjusts its height or position when the virtual keyboard appears (using behavior="padding", "height", or "position"). For complex forms, community libraries like react-native-keyboard-aware-scroll-view provide superior automatic scrolling to the active text input.'
    },
    {
      id: 'rn-17',
      q: 'What is the purpose of StyleSheet.create() vs inline styles in React Native?',
      a: 'StyleSheet.create sends styles through the bridge only once during module initialization, assigning them unique numeric IDs. Re-renders reference the cached integer ID rather than creating new JavaScript style objects on every render cycle.'
    },
    {
      id: 'rn-18',
      q: 'How do you handle Offline-First architecture and local database synchronization in React Native?',
      a: 'Store data locally in fast embedded databases like WatermelonDB (SQLite backed, lazy-loading) or Realm. Network requests write to local DB first; a background synchronization manager queues offline mutations and reconciles deltas with the backend once online connectivity is restored.'
    },
    {
      id: 'rn-19',
      q: 'What is Push Notification architecture (APNs and FCM) in React Native?',
      a: '1) App registers with device OS and receives a unique Push Token (FCM token on Android, APNs device token on iOS). 2) Token is sent to backend server. 3) Backend sends notification payload to FCM/APNs. 4) OS wakes app to display notification; background notification handlers (notifee) process data payloads.'
    },
    {
      id: 'rn-20',
      q: 'How do you optimize Image loading and caching in React Native (FastImage)?',
      a: 'Standard React Native <Image> has poor aggressive caching and flickers on re-render. react-native-fast-image wraps native Glide (Android) and SDWebImage (iOS), providing priority loading, disk/memory caching, preload methods, and GIF support.'
    },
    {
      id: 'rn-21',
      q: 'What is the difference between Platform.OS, Platform.select, and file extensions (.ios.js, .android.js)?',
      a: 'Platform.OS returns \'ios\' or \'android\'. Platform.select({ ios: 10, android: 20 }) returns platform-specific values. For large divergent component logic, creating Button.ios.js and Button.android.js allows the Metro bundler to bundle only the relevant platform file at compile time.'
    },
    {
      id: 'rn-22',
      q: 'What is Metro Bundler and what are its responsibilities?',
      a: 'Metro is the purpose-built JavaScript bundler for React Native. It resolves dependencies from entry points, transforms modern JS/JSX using Babel, provides sub-second Hot Module Replacement (HMR), and packages all code into a single production bundle (index.android.bundle / main.jsbundle).'
    },
    {
      id: 'rn-23',
      q: 'What is ProGuard and R8 in Android React Native release builds?',
      a: 'R8 / ProGuard is an Android build tool that shrinks, obfuscates, and optimizes Java/Kotlin bytecode. It strips unused classes and libraries (tree-shaking), renames classes to short letters (obfuscation), and reduces APK file sizes by 30-50%.'
    },
    {
      id: 'rn-24',
      q: 'What is react-native-svg and how do you use vector icons across platforms?',
      a: 'react-native-svg provides SVG support on React Native. Using tools like SVGR, SVG files are converted into native React components, rendering crisp vector graphics and icons on all device screen densities without shipping multiple PNG resolutions (@1x, @2x, @3x).'
    },
    {
      id: 'rn-25',
      q: 'How does Biometric Authentication (Face ID / Fingerprint) work in React Native?',
      a: 'Libraries like expo-local-authentication or react-native-biometrics prompt platform biometrics (LocalAuthentication on iOS, BiometricPrompt on Android). They can also generate a public/private key pair inside the Secure Enclave, signing a challenge to prove user authentication cryptographically.'
    },
    {
      id: 'rn-26',
      q: 'What is Accessibility (a11y) in React Native (accessible, accessibilityLabel, accessibilityRole)?',
      a: 'accessible={true} groups child components into a single selectable accessibility element for VoiceOver (iOS) and TalkBack (Android). accessibilityLabel provides the screen reader text. accessibilityRole (button, header, link) informs the assistive engine how to announce the element.'
    },
    {
      id: 'rn-27',
      q: 'How do you manage Splash Screens smoothly without visual flicker (react-native-bootsplash)?',
      a: 'A native splash screen displays before the React Native JavaScript context finishes initializing. Libraries like react-native-bootsplash keep the native launch screen visible until the JS bundle finishes loading, fonts are cached, and the initial screen renders, calling BootSplash.hide({ fade: true }).'
    },
    {
      id: 'rn-28',
      q: 'What is App Thinning / Android App Bundle (.aab) vs APK?',
      a: 'An APK contains code and assets for all CPU architectures and screen densities. An Android App Bundle (.aab) is submitted to Google Play, which uses Dynamic Delivery to generate optimized device-specific APKs containing only the resources matching the user’s device, reducing download size.'
    },
    {
      id: 'rn-29',
      q: 'What is Code Signing in iOS and Android releases?',
      a: 'iOS code signing requires an Apple Developer Certificate, an App ID, and a Provisioning Profile to sign IPA binaries for TestFlight/App Store. Android uses a cryptographic KeyStore (.jks file) with alias and password to sign release AAB/APK packages.'
    },
    {
      id: 'rn-30',
      q: 'How do you write Unit and End-to-End (E2E) Tests in React Native (Jest, Detox)?',
      a: 'Unit/Component testing uses Jest and React Native Testing Library (RNTL) to test rendered component outputs, user event simulations, and mock native modules. E2E testing uses Detox to execute automated user journeys on real iOS Simulators and Android Emulators.'
    }
  ],

  // -------------------------------------------------------------
  // 5. FLUTTER & DART (30 Questions)
  // -------------------------------------------------------------
  flutter: [
    {
      id: 'fl-1',
      q: 'What is Flutter architecture and how does the Skia / Impeller rendering engine differ from React Native?',
      a: 'React Native bridges to platform native widgets (UIView on iOS, android.view on Android). Flutter bypasses platform OEM widgets entirely: it compiles Dart code directly to native ARM machine code and paints every pixel directly onto a canvas using its own rendering engine (Impeller on iOS/modern Android, Skia on older platforms), guaranteeing identical 60/120fps UI across all platforms.'
    },
    {
      id: 'fl-2',
      q: 'What are the Three Trees in Flutter: Widget Tree, Element Tree, and RenderObject Tree?',
      a: '1) Widget Tree: lightweight, immutable blueprint configuration of the UI. 2) Element Tree: manages component lifecycle, holds state, and acts as the bridge connecting widgets to RenderObjects. 3) RenderObject Tree: heavy, mutable objects that compute exact layout geometry (sizing, constraints) and paint pixels to the screen.'
    },
    {
      id: 'fl-3',
      q: 'What is the difference between StatelessWidget and StatefulWidget?',
      a: 'StatelessWidget is immutable and has no internal state that changes over time; it overrides the build(BuildContext) method. StatefulWidget is also immutable, but creates an associated mutable State object (createState()) that persists across rebuilds and calls setState() to trigger UI re-renders.'
    },
    {
      id: 'fl-4',
      q: 'Explain the Flutter State Lifecycle (createState, initState, didChangeDependencies, build, dispose).',
      a: '1) createState(): creates mutable state. 2) initState(): one-time initialization, subscribe to streams/controllers. 3) didChangeDependencies(): called when inherited widgets change. 4) build(): called whenever setState() is called. 5) didUpdateWidget(): when parent widget configuration changes. 6) dispose(): clean up controllers, timers, animations.'
    },
    {
      id: 'fl-5',
      q: 'What is "Constraints Go Down, Sizes Go Up, Parent Sets Position" in Flutter layout rules?',
      a: 'Flutter layout rule: A parent passes constraints (min/max width and height) down to its child. The child decides its own size within those constraints and passes the size up to the parent. The parent then positions the child in the coordinate space.'
    },
    {
      id: 'fl-6',
      q: 'What is BLoC (Business Logic Component) Pattern and how do Streams, Sinks, and Cubits work?',
      a: 'BLoC separates presentation from business logic using reactive Streams. UI dispatches Events to the BLoC; BLoC processes logic and emits new States via StreamController. BlocBuilder listens to state streams and rebuilds UI. Cubit is a simplified BLoC subclass that exposes methods rather than event sinks.'
    },
    {
      id: 'fl-7',
      q: 'What is Provider and Riverpod in Flutter state management?',
      a: 'Provider wraps InheritedWidget for dependency injection and state management using ChangeNotifier. Riverpod is a complete rewrite of Provider by the same author that does not depend on the Flutter widget tree (compile-safe, no BuildContext required, supports multiple providers of same type, auto-disposes state).'
    },
    {
      id: 'fl-8',
      q: 'What is the purpose of BuildContext in Flutter?',
      a: 'BuildContext is a handle to the location of a widget within the Element Tree. It allows a widget to inspect ancestor elements, look up InheritedWidgets (Theme.of(context), Navigator.of(context)), and query layout dimensions (MediaQuery.of(context)).'
    },
    {
      id: 'fl-9',
      q: 'What is the difference between Hot Reload and Hot Restart in Flutter?',
      a: 'Hot Reload injects updated source code into the running Dart VM, rebuilding the widget tree while preserving app state in memory (~1 second). Hot Restart completely restarts the Dart app, losing in-memory state and re-running main() and initState(), but is faster than a full cold build.'
    },
    {
      id: 'fl-10',
      q: 'What are Platform Channels (MethodChannel, EventChannel, BasicMessageChannel)?',
      a: 'Platform Channels communicate between Dart and native host code (Swift/Kotlin). MethodChannel handles asynchronous method calls (request-response). EventChannel streams continuous events (sensor data, location updates). BasicMessageChannel passes asynchronous strings or binary messages.'
    },
    {
      id: 'fl-11',
      q: 'What is Null Safety in Dart and what are ?, !, and late keywords?',
      a: 'Sound Null Safety guarantees variables cannot contain null unless explicitly declared nullable: String? name = null. The ! assertion operator forces Dart to treat a nullable variable as non-null (throws runtime error if null). The late keyword defers variable initialization until first access while enforcing non-nullability.'
    },
    {
      id: 'fl-12',
      q: 'What is InheritedWidget in Flutter and why is it the foundation of Theme and Provider?',
      a: 'InheritedWidget is a base class for widgets that efficiently propagate data down the widget tree. When its data changes, only descendant widgets that subscribed via dependOnInheritedWidgetOfExactType() rebuild, avoiding rebuilding the entire subtree.'
    },
    {
      id: 'fl-13',
      q: 'What is FutureBuilder vs StreamBuilder in Flutter?',
      a: 'FutureBuilder listens to a one-time asynchronous computation (Future) and builds widgets based on ConnectionState (waiting, done, hasError, hasData). StreamBuilder listens to continuous asynchronous streams of events (e.g. WebSockets, Firebase real-time database), rebuilding whenever a new event is emitted.'
    },
    {
      id: 'fl-14',
      q: 'What is the purpose of Keys in Flutter: ValueKey, ObjectKey, and GlobalKey?',
      a: 'Keys preserve widget state when widgets move around the element tree (e.g. reordering list items). ValueKey matches primitive values. ObjectKey matches object identities. GlobalKey provides unique access across the entire app to a widget’s State and RenderBox from anywhere.'
    },
    {
      id: 'fl-15',
      q: 'What is an Isolate in Dart and how does multithreading work without shared memory?',
      a: 'Dart code runs in a single-threaded Event Loop inside an Isolate. Unlike OS threads that share memory and require mutex locks, Dart Isolates have completely private, isolated memory heaps. Isolates communicate exclusively by passing messages across SendPort and ReceivePort.'
    },
    {
      id: 'fl-16',
      q: 'What is the compute() function in Flutter?',
      a: 'compute(callback, message) is a top-level helper that automatically spawns a background Isolate, runs an expensive CPU-bound task (e.g. parsing a 10MB JSON response or resizing images), passes the result back to the main UI isolate, and kills the worker isolate without freezing the UI.'
    },
    {
      id: 'fl-17',
      q: 'What is CustomPainter and when should you draw on Canvas directly?',
      a: 'CustomPainter allows drawing custom 2D vector shapes, charts, and graphics directly onto the canvas using Paint and Canvas primitives (drawLine, drawCircle, drawPath) inside the paint(Canvas canvas, Size size) method, with shouldRepaint() optimizing redraws.'
    },
    {
      id: 'fl-18',
      q: 'What is Navigator 2.0 (Router, RouteInformationParser) in Flutter?',
      a: 'Navigator 1.0 is imperative (Navigator.push/pop), struggling with web URLs and deep linking. Navigator 2.0 (Declarative Navigation) synchronizes app navigation state with browser history and deep links using Router, RouteInformationParser, and RouterDelegate (popularized by packages like GoRouter).'
    },
    {
      id: 'fl-19',
      q: 'What is Impeller and how does it solve Shader Compilation Jitter in Flutter?',
      a: 'On iOS, Skia compiled graphics shaders just-in-time (JIT) at runtime on the first animation frame, causing visible frame drops (jank). Impeller pre-compiles a fixed set of shaders ahead-of-time during build time using Metal (iOS) and Vulkan (Android), delivering silky smooth 60/120fps from the very first frame.'
    },
    {
      id: 'fl-20',
      q: 'What are Slivers in Flutter (CustomScrollView, SliverAppBar, SliverList)?',
      a: 'A Sliver is a portion of a scrollable area that behaves lazily and implements custom scroll effects. CustomScrollView coordinates multiple slivers: SliverAppBar creates collapsing/floating navigation headers, and SliverList/SliverGrid lazily renders child items as they scroll into view.'
    },
    {
      id: 'fl-21',
      q: 'What is Hero Animation in Flutter?',
      a: 'A Hero animation smoothly animates a shared widget (e.g. an image thumbnail) from one screen route to another. Wrapping the element in Hero(tag: "id", child: ...) on both screens causes Flutter to calculate the flying trajectory between screen coordinates automatically.'
    },
    {
      id: 'fl-22',
      q: 'What is the difference between const constructors and non-const constructors in Flutter widgets?',
      a: 'Declaring widgets with const tells the Dart compiler that the widget is immutable at compile time. During rebuilds, Flutter reuses the exact same in-memory widget instance and completely skips rebuilding that subtree, dramatically reducing garbage collection pauses.'
    },
    {
      id: 'fl-23',
      q: 'How do you optimize Flutter app performance (RepaintBoundary, avoid rebuilding fat widgets)?',
      a: '1) Wrap complex animated or frequently updating widgets in RepaintBoundary to isolate paint cycles from surrounding views. 2) Break large widgets into smaller sub-widgets with const constructors. 3) Avoid calling expensive functions inside build() methods. 4) Use ListView.builder.'
    },
    {
      id: 'fl-24',
      q: 'What is MethodChannel error handling and asynchronous responses in Flutter?',
      a: 'Dart calls await channel.invokeMethod(\'methodName\', args) inside a try-catch block catching PlatformException. Native Kotlin/Swift code handles calls inside a switch/case and returns result.success(data) or result.error("CODE", "Message", details).'
    },
    {
      id: 'fl-25',
      q: 'What is Flutter Web and how does CanvasKit / WASM differ from HTML renderer?',
      a: 'HTML renderer uses HTML elements, CSS, and Canvas to build UI (smaller download size, faster initial load). CanvasKit renderer downloads the Skia engine compiled to WebAssembly (WASM), rendering with 100% pixel parity with mobile Flutter at 60fps, ideal for rich dashboards and web apps.'
    },
    {
      id: 'fl-26',
      q: 'What are Mixins in Dart and how does the with keyword work?',
      a: 'Mixins allow sharing reusable methods and fields across multiple class hierarchies without multiple inheritance. A class incorporates mixins using class MyWidget with SingleTickerProviderStateMixin. Mixins cannot declare generative constructors.'
    },
    {
      id: 'fl-27',
      q: 'How does Dependency Injection work in Flutter (get_it, injectable)?',
      a: 'get_it is a simple Service Locator for Dart that registers singletons, lazy singletons, and factory instances (getIt.registerSingleton<AuthService>(AuthService())). UI widgets retrieve dependencies via getIt<AuthService>(), decoupling business logic from UI trees.'
    },
    {
      id: 'fl-28',
      q: 'What is the difference between Expanded, Flexible, and Spacer in Flutter?',
      a: 'Inside a Row/Column: Flexible lets a child resize with flex factor without forcing it to fill all available space (fit: FlexFit.loose). Expanded forces the child to fill all remaining space (fit: FlexFit.tight). Spacer is an empty Expanded widget that creates adjustable blank space.'
    },
    {
      id: 'fl-29',
      q: 'What is Hive and Isar in local Flutter data storage?',
      a: 'Hive is a lightweight, blazing-fast key-value NoSQL database written in pure Dart with zero native dependencies. Isar is its high-performance successor, offering full ACID transactions, static typing, composite indexes, query filters, and multi-isolate support.'
    },
    {
      id: 'fl-30',
      q: 'How do you test Flutter apps (Unit Tests, Widget Tests, Integration Tests)?',
      a: 'Unit tests (test package) test functions and business logic. Widget tests (testWidgets and WidgetTester) verify UI rendering, finding widgets via find.byType(), and simulating taps (tester.tap()). Integration tests (integration_test) test full app flows on real devices/emulators.'
    }
  ],

  // -------------------------------------------------------------
  // 6. ANDROID NATIVE (KOTLIN) (30 Questions)
  // -------------------------------------------------------------
  android_kotlin: [
    {
      id: 'kt-1',
      q: 'Explain the Android Activity Lifecycle and how configuration changes (screen rotation) impact it.',
      a: 'Lifecycle: onCreate -> onStart -> onResume -> (Running) -> onPause -> onStop -> onDestroy. When a configuration change occurs (e.g. screen rotation), Android destroys the activity (onDestroy) and recreates a new instance. Modern apps retain UI state across recreations using ViewModel, Jetpack Compose, and SavedStateHandle.'
    },
    {
      id: 'kt-2',
      q: 'What is Jetpack Compose and how does Declarative UI differ from XML Views?',
      a: 'XML Views use imperative DOM-like view hierarchies where developers manually mutate view properties (findViewById, setText()). Jetpack Compose is a declarative UI toolkit: UI is defined as composable functions (@Composable) that transform application state into UI elements. When state changes, Compose re-executes composables via Recomposition, updating only modified nodes.'
    },
    {
      id: 'kt-3',
      q: 'What are Kotlin Coroutines and how does Dispatchers (Main, IO, Default) work?',
      a: 'Coroutines are lightweight threads for asynchronous non-blocking programming. Suspend functions pause execution without blocking the underlying OS thread. Dispatchers: Dispatchers.Main (UI thread operations), Dispatchers.IO (optimized for blocking disk and network I/O with elastic thread pool), Dispatchers.Default (optimized for CPU-intensive computations using pool equal to CPU cores).'
    },
    {
      id: 'kt-4',
      q: 'What is Kotlin Flow (StateFlow vs SharedFlow) and how do they compare to LiveData?',
      a: 'Kotlin Flow is a reactive asynchronous data stream supporting backpressure and operators. LiveData is lifecycle-aware but tied to the Android platform. StateFlow is a state-holder observable flow emitting the current and new state to collectors (replay=1), ideal for UI state. SharedFlow emits events (one-time navigation, snackbars) with configurable replay buffers.'
    },
    {
      id: 'kt-5',
      q: 'What is the ViewModel in Android Jetpack and why does it survive configuration changes?',
      a: 'ViewModel manages UI-related data and business logic. It survives configuration changes (like screen rotation) because its lifecycle is tied to the ViewModelStore of the host activity, persisting until the activity finishes permanently.'
    },
    {
      id: 'kt-6',
      q: 'What is Recomposition in Jetpack Compose and how does remember and mutableStateOf work?',
      a: 'Recomposition is the process of re-calling composable functions when their state dependencies change. mutableStateOf(value) creates an observable MutableState object that triggers recomposition when mutated. remember { mutableStateOf() } caches the state value in the composition across recomposition cycles.'
    },
    {
      id: 'kt-7',
      q: 'What is Dependency Injection in Android using Hilt / Dagger?',
      a: 'Hilt is a standard dependency injection library for Android built on Dagger. It provides predefined component containers (@HiltAndroidApp, @AndroidEntryPoint, @HiltViewModel) that automatically manage object creation and scoped lifecycles (SingletonComponent, ActivityComponent) at compile time.'
    },
    {
      id: 'kt-8',
      q: 'What is Room Database in Android Jetpack and how do Entity, DAO, and TypeConverters work?',
      a: 'Room is an abstraction layer over SQLite. @Entity defines the table schema. @Dao (Data Access Object) defines SQL queries and CRUD methods as coroutine suspend functions or Flow returns. @TypeConverter converts complex objects (like Date or custom lists) to primitives that SQLite can store.'
    },
    {
      id: 'kt-9',
      q: 'What is WorkManager and when should you use it over Coroutines or Foreground Services?',
      a: 'WorkManager is the recommended Android API for persistent, deferrable background tasks that are guaranteed to execute even if the app exits or device restarts (e.g. uploading logs, syncing database). It respects Battery optimizations (Doze mode) and executes based on constraints (network connected, charging).'
    },
    {
      id: 'kt-10',
      q: 'What is a Foreground Service and what are Android 14 requirements for Foreground Services?',
      a: 'A Foreground Service performs operations noticeable to the user (music playback, GPS navigation) and requires a persistent, non-dismissible notification. In Android 14+, developers must declare explicit foregroundServiceType (location, mediaPlayback, microphone) in the manifest and request runtime permissions.'
    },
    {
      id: 'kt-11',
      q: 'What is the difference between Launch and Async in Kotlin Coroutines?',
      a: 'launch launches a new coroutine without blocking and returns a Job; it follows "fire-and-forget" semantics and propagates unhandled exceptions immediately. async returns a Deferred<T>, allowing you to call await() to retrieve the result and handle exceptions.'
    },
    {
      id: 'kt-12',
      q: 'What is Structured Concurrency and CoroutineScope in Kotlin?',
      a: 'Structured concurrency ensures new coroutines are launched only within specific CoroutineScopes with defined lifecycles (e.g. viewModelScope, lifecycleScope). If a parent scope cancels, all child coroutines are automatically cancelled, preventing coroutine leaks.'
    },
    {
      id: 'kt-13',
      q: 'What is RecyclerView and how does the ViewHolder pattern optimize list rendering?',
      a: 'RecyclerView recycles item views as they scroll off-screen. The ViewHolder pattern caches references to subviews (findViewById), eliminating expensive view hierarchy lookups during scrolling. ListAdapter with DiffUtil computes asynchronous diffs on background threads to animate changes smoothly.'
    },
    {
      id: 'kt-14',
      q: 'What is Android Doze Mode and App Standby and how do they impact background work?',
      a: 'Doze mode reduces battery consumption when a device is unplugged, stationary, and screen is off by deferring network access, background jobs, and syncs into periodic maintenance windows. App Standby defers background tasks for apps that have not been actively used recently.'
    },
    {
      id: 'kt-15',
      q: 'What is Retrofit and how do OkHttp Interceptors work?',
      a: 'Retrofit is a type-safe HTTP client for Android turning HTTP APIs into Kotlin interfaces with suspend functions. OkHttp interceptors intercept, inspect, and mutate outgoing requests and incoming responses (e.g. adding Authorization: Bearer headers, logging, offline caching, and token refresh).'
    },
    {
      id: 'kt-16',
      q: 'What are Intent and Intent Filters: Explicit vs Implicit Intents?',
      a: 'An Intent is an asynchronous messaging object. Explicit Intents specify the exact target component class name (Intent(this, DetailActivity::class.java)). Implicit Intents declare a general action to perform (Intent.ACTION_VIEW with a URI), allowing the Android OS to launch matching apps via Intent Filters.'
    },
    {
      id: 'kt-17',
      q: 'What is Data Binding vs View Binding in Android?',
      a: 'View Binding generates a binding class for each XML layout containing direct references to all views with IDs, providing compile-time null safety and type safety. Data Binding extends View Binding by allowing expressions and data variables to be bound directly inside XML layouts.'
    },
    {
      id: 'kt-18',
      q: 'What is Memory Leak in Android and how does LeakCanary detect it?',
      a: 'A memory leak occurs when an object that is no longer needed (like a destroyed Activity) is retained in memory by an active reference (static variables, unclosed listeners, long-running coroutines). LeakCanary monitors weak references to destroyed activities/fragments; if not collected after GC, it dumps the heap and traces the leak path.'
    },
    {
      id: 'kt-19',
      q: 'What is SharedPreferences vs Jetpack DataStore (Preferences DataStore vs Proto DataStore)?',
      a: 'SharedPreferences uses synchronous I/O on UI thread (causing ANRs) and lacks error handling. Jetpack DataStore is modern, safe, and asynchronous based on Kotlin Coroutines and Flow: Preferences DataStore stores key-value pairs; Proto DataStore stores typed objects using Protocol Buffers.'
    },
    {
      id: 'kt-20',
      q: 'What is ANR (Application Not Responding) in Android and what causes it?',
      a: 'An ANR dialog triggers when an application blocks the Main / UI thread for more than 5 seconds (or broadcast receivers for > 10s). Common causes: executing database queries, disk I/O, network calls, or heavy loops on Dispatchers.Main.'
    },
    {
      id: 'kt-21',
      q: 'What is Fragment Lifecycle and how does it correlate with Activity Lifecycle?',
      a: 'Fragments have their own lifecycle: onAttach -> onCreate -> onCreateView (creates view) -> onViewCreated -> onStart -> onResume -> onPause -> onStop -> onDestroyView (view destroyed) -> onDestroy -> onDetach. Note: a Fragment instance can outlive its View.'
    },
    {
      id: 'kt-22',
      q: 'What is Scoped Storage in modern Android (Android 10+)?',
      a: 'Scoped Storage isolates an app\'s file storage: apps have direct access to their private internal/external sandbox directories without runtime permissions. Accessing shared media (photos, audio) requires Storage Access Framework (SAF) or MediaStore API, preventing broad filesystem access.'
    },
    {
      id: 'kt-23',
      q: 'What is Clean Architecture in Android (Data, Domain, Presentation layers)?',
      a: 'Clean Architecture enforces dependency rules pointing inward: Presentation layer (Compose, ViewModel) depends on Domain layer. Domain layer (UseCases, Domain Models) contains pure business logic independent of Android framework. Data layer (Repository, Network, Room DB) implements repository interfaces.'
    },
    {
      id: 'kt-24',
      q: 'What is Navigation Component in Android Jetpack (NavHost, NavGraph)?',
      a: 'Navigation Component manages in-app navigation. NavGraph is an XML or Kotlin DSL declaring all destinations (activities, fragments, composables) and actions. NavHost is an empty container showing current destination. NavController manages navigation and back-stack transactions.'
    },
    {
      id: 'kt-25',
      q: 'What are Extension Functions in Kotlin and how are they compiled under the hood?',
      a: 'Extension functions extend a class with new functionality without inheriting from it (e.g. fun String.isValidEmail(): Boolean). Under the hood, Kotlin compiles them into static Java methods where the receiver object is passed as the first parameter (public static boolean isValidEmail(String $this)).'
    },
    {
      id: 'kt-26',
      q: 'What are Sealed Classes and Sealed Interfaces in Kotlin and how do they empower MVI state management?',
      a: 'Sealed classes/interfaces represent restricted class hierarchies where all subclasses are known at compile time. In MVI (Model-View-Intent), UI State is modeled as a sealed interface (Loading, Success(data), Error(msg)), allowing the compiler to enforce exhaustive when statements without else.'
    },
    {
      id: 'kt-27',
      q: 'What is Baseline Profiles in Android Jetpack and how do they eliminate JIT compilation lag?',
      a: 'Baseline Profiles are pre-compiled specs bundled into APKs that specify critical code paths to compile ahead-of-time (AOT) via Android Runtime (ART) during installation, improving app startup time by 30-40% and eliminating frame drops on first launch.'
    },
    {
      id: 'kt-28',
      q: 'What is In-App Updates API and In-App Review API in Android?',
      a: 'In-App Updates (Google Play Core) prompts users to update the app without leaving the app: Flexible update (background download while user uses app) or Immediate update (full screen blocker for critical security patches). In-App Review allows users to submit Play Store ratings within the app.'
    },
    {
      id: 'kt-29',
      q: 'What is StrictMode in Android and how does it catch disk and network violations?',
      a: 'StrictMode is a developer tool that detects accidental disk I/O, network calls, or memory leaks occurring on the main UI thread. When a policy violation occurs, StrictMode flashes the screen, logs stack traces, or crashes the app to enforce clean code.'
    },
    {
      id: 'kt-30',
      q: 'How do you perform Unit and UI Testing in Android (MockK, Robolectric, ComposeTestRule)?',
      a: 'Unit testing uses JUnit 5 with MockK for mocking Kotlin coroutines and dependencies. Robolectric runs Android framework tests on JVM without real devices. Compose UI tests use createComposeRule() to find nodes via semantics (onNodeWithText()) and perform actions.'
    }
  ],

  // -------------------------------------------------------------
  // 7. IOS NATIVE (SWIFT) (30 Questions)
  // -------------------------------------------------------------
  ios_swift: [
    {
      id: 'swift-1',
      q: 'What is the difference between SwiftUI and UIKit?',
      a: 'UIKit is an imperative, event-driven framework where views are mutable instances of UIView/UIViewController managed manually. SwiftUI is Apple’s modern declarative UI framework where views are lightweight, immutable structs describing the UI state. When state changes (@State, @Published), SwiftUI automatically diffs and re-renders modified views.'
    },
    {
      id: 'swift-2',
      q: 'Explain Automatic Reference Counting (ARC) and how Strong, Weak, and Unowned references prevent retain cycles.',
      a: 'ARC automatically manages memory by keeping track of active references to class instances. A strong reference increases the reference count by 1. A retain cycle occurs when two objects hold strong references to each other, preventing count from reaching 0 and causing a memory leak. weak references do not increase count and become nil when the object deallocates (always Optional). unowned does not increase count but assumes the object will never be nil.'
    },
    {
      id: 'swift-3',
      q: 'What is Swift Concurrency: async/await, Task, Actors, and MainActor?',
      a: 'Swift Concurrency replaces completion handlers with structured async/await. Task creates a scoped asynchronous unit of work. Actors are reference types that protect their mutable state from data races by ensuring only one thread can access their properties/methods at a time. @MainActor guarantees code executes on the main thread for UI updates.'
    },
    {
      id: 'swift-4',
      q: 'What is the View Lifecycle in UIKit (viewDidLoad, viewWillAppear, viewDidAppear, viewDidDisappear)?',
      a: '1) loadView: creates or loads view hierarchy. 2) viewDidLoad: called once when view is loaded into memory (ideal for setup). 3) viewWillAppear: called right before view becomes visible on screen. 4) viewDidAppear: view is on screen (start animations, fetch data). 5) viewWillDisappear / viewDidDisappear: cleanup.'
    },
    {
      id: 'swift-5',
      q: 'What are Property Wrappers in SwiftUI (@State, @Binding, @ObservedObject, @StateObject, @EnvironmentObject)?',
      a: '@State: private value state owned by the view. @Binding: two-way reference to state owned by a parent. @StateObject: instantiates and owns an ObservableObject lifecycle across view rebuilds. @ObservedObject: subscribes to an external ObservableObject passed in. @EnvironmentObject: injects global observable state down the entire view tree.'
    },
    {
      id: 'swift-6',
      q: 'What is the difference between Value Types (Struct, Enum) and Reference Types (Class) in Swift?',
      a: 'Structs and Enums are Value Types allocated on the stack (passed by value / copied on assignment). They are thread-safe and have no inheritance. Classes and Actors are Reference Types allocated on the heap (passed by reference / pointers). Classes support inheritance and deinitializers (deinit).'
    },
    {
      id: 'swift-7',
      q: 'What is Grand Central Dispatch (GCD) and DispatchQueue (Main, Global, Serial, Concurrent)?',
      a: 'GCD manages concurrent operations via queues. DispatchQueue.main runs on the main thread. DispatchQueue.global() runs background tasks with Quality of Service (QoS: userInteractive, userInitiated, utility, background). Serial queues execute tasks FIFO one at a time. Concurrent queues execute tasks concurrently.'
    },
    {
      id: 'swift-8',
      q: 'What is Combine Framework and how do Publishers, Subscribers, and AnyCancellable work?',
      a: 'Combine is Apple\'s declarative reactive framework. A Publisher emits a sequence of values over time. A Subscriber receives values. Operators (map, filter, debounce) transform streams. AnyCancellable retains the subscription token; when deallocated, it automatically cancels the subscription pipeline.'
    },
    {
      id: 'swift-9',
      q: 'What is Auto Layout and Intrinsic Content Size in UIKit?',
      a: 'Auto Layout calculates the size and position of all views based on constraints. Intrinsic Content Size is the natural size a view requires based on its content (e.g. a UILabel\'s intrinsic size matches its text length and font). Compression Resistance prevents views from shrinking; Content Hugging prevents views from expanding.'
    },
    {
      id: 'swift-10',
      q: 'What is Core Data and how does it compare to SwiftData (iOS 17+)?',
      a: 'Core Data is an object graph management and persistence framework backed by SQLite. SwiftData is its modern successor designed for Swift and SwiftUI: it replaces NSManagedObject and XML data models with pure Swift macros (@Model) and uses Swift types and Predicates natively.'
    },
    {
      id: 'swift-11',
      q: 'What is the difference between Synchronous and Asynchronous tasks in DispatchGroup?',
      a: 'DispatchGroup aggregates multiple asynchronous tasks. group.enter() increments counter; group.leave() decrements it. group.notify(queue: .main) executes a completion callback once all tasks complete, useful for waiting on multiple independent parallel network requests.'
    },
    {
      id: 'swift-12',
      q: 'What is Keychain Services and how do you store sensitive passwords on iOS?',
      a: 'iOS Keychain is an encrypted SQLite database managed by the securityd daemon, backed by hardware encryption (Secure Enclave). Data stored in the Keychain persists even if the app is uninstalled and reinstalled, making it the standard location for authentication tokens and credentials.'
    },
    {
      id: 'swift-13',
      q: 'What is Method Swizzling in Objective-C / Swift and why is it risky?',
      a: 'Method swizzling changes the implementation of an existing selector at runtime using the Objective-C runtime API (method_exchangeImplementations). It is used by analytics SDKs to auto-track screen views, but is risky because it causes unpredictable side effects and breaks third-party libraries.'
    },
    {
      id: 'swift-14',
      q: 'What are Protocols and Protocol Extensions in Swift and "Protocol-Oriented Programming"?',
      a: 'Protocols define a blueprint of methods and properties. Unlike traditional OOP that relies on base class inheritance, Swift emphasizes Protocol-Oriented Programming: protocol extensions provide default implementations for protocol methods, enabling composition and horizontal reuse without inheritance.'
    },
    {
      id: 'swift-15',
      q: 'What is URLSession and how do URLSessionDataTask, URLSessionDownloadTask, and background sessions work?',
      a: 'URLSession is the primary networking API in iOS. DataTask fetches data into memory. DownloadTask downloads files directly to a temporary disk location. Background sessions hand off uploads/downloads to the iOS background transfer daemon, continuing even if the app is suspended or terminated.'
    },
    {
      id: 'swift-16',
      q: 'What is Copy-on-Write (COW) optimization in Swift standard library collections (Array, Dictionary)?',
      a: 'COW ensures that when an Array or Dictionary is copied, both instances point to the same underlying buffer in memory. An actual physical copy of the buffer is made ONLY when one of the instances mutates its elements, maximizing memory performance.'
    },
    {
      id: 'swift-17',
      q: 'What is MVVM vs VIPER architectural patterns in iOS development?',
      a: 'MVVM: Model (data), View (UI), ViewModel (transforms data for view and handles user actions). VIPER: View, Interactor (business logic), Presenter (formats data for view), Entity (models), and Router / Wireframe (navigation). VIPER has high separation of concerns for large enterprise teams.'
    },
    {
      id: 'swift-18',
      q: 'What is App Thinning (Slicing, Bitcode, On-Demand Resources) in iOS App Store delivery?',
      a: 'App Slicing: App Store creates customized device-specific IPA variants containing only the executable architecture (arm64) and asset resolutions (@2x, @3x) needed for the user’s device. On-Demand Resources: assets (game levels) are downloaded dynamically when needed.'
    },
    {
      id: 'swift-19',
      q: 'What is App Transport Security (ATS) in iOS?',
      a: 'ATS enforces secure HTTPS connections for all network requests. By default, iOS blocks cleartext HTTP connections unless explicit domain exceptions are defined in the Info.plist under NSAppTransportSecurity.'
    },
    {
      id: 'swift-20',
      q: 'What are Generics and Associated Types (associatedtype) in Swift?',
      a: 'Generics allow writing flexible, reusable functions and types that work with any type (func swapTwoValues<T>(_ a: inout T, _ b: inout T)). In protocols, associatedtype defines a placeholder type that conforming types specify (e.g. IteratorProtocol has associatedtype Element).'
    },
    {
      id: 'swift-21',
      q: 'What is UIApplicationDelegate and UIWindowSceneDelegate in iOS app lifecycle?',
      a: 'AppDelegate handles application-level lifecycle events (push notification registration, process launch/termination). SceneDelegate (introduced in iOS 13 for multi-window iPad support) handles UI lifecycle events for specific window scenes (sceneDidBecomeActive, sceneDidEnterBackground).'
    },
    {
      id: 'swift-22',
      q: 'What is Lazy Stored Property (lazy var) in Swift and is it thread-safe?',
      a: 'A lazy stored property calculates its initial value only when first accessed. It is NOT thread-safe: if multiple threads access an uninitialized lazy property simultaneously, multiple initializations can occur.'
    },
    {
      id: 'swift-23',
      q: 'What is XCTest and how do you test asynchronous code using XCTestExpectation?',
      a: 'XCTest is Apple’s testing framework. For asynchronous testing, create an expectation (expectation(description: "Fetch API")), call expectation.fulfill() in the callback or async function, and wait for expectations using await fulfillment(of: [expectation], timeout: 5.0).'
    },
    {
      id: 'swift-24',
      q: 'What is instruments in Xcode and how do you profile Time Profiler and Leaks?',
      a: 'Instruments is Xcode’s performance profiling suite. Time Profiler records CPU execution stacks to identify bottlenecks and main-thread hangs. Leaks instrument identifies unreferenced memory blocks and retain cycles in real time.'
    },
    {
      id: 'swift-25',
      q: 'What is Dynamic Island and Live Activities (ActivityKit) in iOS 16+?',
      a: 'ActivityKit displays real-time persistent event updates (e.g. food delivery, sports scores) on the Lock Screen and Dynamic Island. Apps define the Live Activity UI using WidgetKit and push remote updates via APNs.'
    },
    {
      id: 'swift-26',
      q: 'What is the difference between Any, AnyObject, and some / any keywords in Swift 5.7+?',
      a: 'Any represents an instance of any type (including value types). AnyObject represents an instance of any class. some Protocol (opaque type) represents a specific concrete type known at compile time. any Protocol (existential type) represents an existential box that can hold any conforming type with runtime overhead.'
    },
    {
      id: 'swift-27',
      q: 'What is @escaping closure in Swift and why does it require self capture consideration?',
      a: 'An escaping closure (@escaping) is passed as an argument to a function but is executed after the function returns (e.g. in an asynchronous network callback). Because the closure outlives the function scope, capturing self strongly can cause a retain cycle, requiring [weak self] capture lists.'
    },
    {
      id: 'swift-28',
      q: 'What is Background App Refresh and BGTaskScheduler?',
      a: 'BGTaskScheduler registers background processing tasks (BGProcessingTaskRequest) and app refresh tasks (BGAppRefreshTaskRequest). iOS decides when to wake the app based on battery, usage patterns, and Wi-Fi connectivity to execute tasks.'
    },
    {
      id: 'swift-29',
      q: 'What is Core Animation (CALayer) and how does it relate to UIView?',
      a: 'UIView handles user interactions (touches) and layout, but delegating the actual drawing, rendering, and compositing to its underlying CALayer. CALayer operates directly on the GPU, handling properties like cornerRadius, shadow, border, and transform.'
    },
    {
      id: 'swift-30',
      q: 'What is Swift Package Manager (SPM) vs CocoaPods / Carthage?',
      a: 'SPM is Apple\'s official, native tool for managing Swift code dependencies, integrated directly into Xcode and git (Package.swift). It eliminates the need for ruby gems or modifying Xcode project files like CocoaPods does.'
    }
  ],

  // -------------------------------------------------------------
  // 8. APACHE SPARK & DISTRIBUTED PROCESSING (30 Questions)
  // -------------------------------------------------------------
  spark: [
    {
      id: 'spk-1',
      q: 'What is Apache Spark Architecture (Driver, Cluster Manager, Executors) and execution flow?',
      a: 'Spark follows a master-slave architecture: The Driver program contains the SparkSession, converts user code into a Directed Acyclic Graph (DAG), coordinates scheduling, and communicates with the Cluster Manager (YARN, K8s, Standalone). The Cluster Manager allocates resources. Executors are worker node JVM processes that run tasks in parallel and store cached data.'
    },
    {
      id: 'spk-2',
      q: 'What is the difference between RDD, DataFrame, and Dataset in Spark?',
      a: 'RDD (Resilient Distributed Dataset): low-level distributed object collection with compile-time type safety but lacks optimization. DataFrame: distributed untyped collection of data organized into named columns (like SQL table) optimized by the Catalyst Optimizer and Tungsten engine. Dataset: strongly-typed JVM collection combining Catalyst optimization with compile-time type safety.'
    },
    {
      id: 'spk-3',
      q: 'What are Spark Transformations (Narrow vs Wide) and Actions?',
      a: 'Transformations are lazy operations that create a new dataset from an existing one: Narrow transformations (map, filter) do not require data shuffling across partitions. Wide transformations (groupByKey, join) require shuffling data across worker nodes. Actions (count, collect, saveAsTextFile) trigger execution of the DAG.'
    },
    {
      id: 'spk-4',
      q: 'What is Data Shuffling in Spark and why is it the biggest performance bottleneck?',
      a: 'Shuffling is the process of redistributing data across executors and partitions across the network when wide transformations (joins, aggregations) occur. It involves disk I/O (writing map status to local disk), network serialization/transfer, and deserialization on reducers, causing high latency and memory pressure.'
    },
    {
      id: 'spk-5',
      q: 'What is the Catalyst Optimizer and what are its 4 optimization phases?',
      a: 'Catalyst is Spark SQL’s extensible query optimizer: 1) Analysis: resolves table and column names using the Catalog. 2) Logical Optimization: applies rule-based optimizations (predicate pushdown, column pruning). 3) Physical Planning: generates multiple physical execution plans and picks the lowest cost plan via cost model. 4) Code Generation: generates Java bytecode at runtime.'
    },
    {
      id: 'spk-6',
      q: 'What is Project Tungsten and how does it optimize memory and CPU in Spark?',
      a: 'Project Tungsten improves Spark performance by: 1) Off-heap memory management using binary row formats, avoiding Java garbage collection overhead and object headers. 2) Cache-aware computation: designing algorithms that fit into L1/L2/L3 CPU caches. 3) Whole-Stage Code Generation: compiling complex physical plans into a single clean bytecode function.'
    },
    {
      id: 'spk-7',
      q: 'What is Broadcast Join (Map-Side Join) and when should it be used?',
      a: 'When joining a large DataFrame with a small DataFrame (default < 10MB, spark.sql.autoBroadcastJoinThreshold), Spark broadcasts the entire small DataFrame to all executor memory nodes. This completely eliminates expensive shuffling of the large table, transforming a slow SortMergeJoin into a fast local map-side lookup.'
    },
    {
      id: 'spk-8',
      q: 'What is Sort-Merge Join vs Shuffle Hash Join in Spark?',
      a: 'Sort-Merge Join (default for large-to-large joins): both tables are shuffled across nodes based on join keys, sorted by key within each partition, and then merged linearly in O(N+M). Shuffle Hash Join: shuffles both datasets by join key, builds an in-memory hash table for the smaller partition, and probes it with the other.'
    },
    {
      id: 'spk-9',
      q: 'What is Data Skew in Spark and how do you diagnose and resolve it (Salting)?',
      a: 'Data skew occurs when one or a few partition keys contain significantly more data than others, causing one executor task to run for hours while others finish in seconds. Diagnose by inspecting task execution times in the Spark UI. Resolve via "Salting": appending a random number (0..K) to the join key to distribute skewed rows across K partitions.'
    },
    {
      id: 'spk-10',
      q: 'What is the difference between repartition() and coalesce() in Spark?',
      a: 'repartition(N) performs a full network shuffle to redistribute data into exactly N partitions, capable of increasing or decreasing partition counts evenly. coalesce(N) decreases partition count without a full shuffle by merging adjacent local partitions on the same node, making it much faster when reducing partition counts.'
    },
    {
      id: 'spk-11',
      q: 'What is Spark Adaptive Query Execution (AQE)?',
      a: 'AQE (enabled by default in Spark 3.0+) optimizes query plans dynamically at runtime based on real-time stage statistics: 1) Dynamically coalesces post-shuffle partitions. 2) Dynamically converts SortMergeJoin to BroadcastHashJoin if runtime table size is small. 3) Dynamically detects and handles data skew by splitting skewed partitions.'
    },
    {
      id: 'spk-12',
      q: 'What are Partitioning and Bucketing in Spark and Hive tables?',
      a: 'Partitioning creates subdirectories based on column values (e.g. /year=2024/month=09/), enabling partition pruning so queries read only relevant folders. Bucketing hashes a column into a fixed number of files within partitions (clustering), optimizing subsequent joins and aggregations on that bucketed column.'
    },
    {
      id: 'spk-13',
      q: 'What is Spark Caching (cache() vs persist()) and StorageLevels?',
      a: 'cache() is shorthand for persist(StorageLevel.MEMORY_AND_DISK). StorageLevels determine where RDD/DataFrame is stored: MEMORY_ONLY, MEMORY_ONLY_SER (serialized bytes, saves RAM), MEMORY_AND_DISK (spills to disk if RAM is exhausted), and _2 (replicates data across two nodes for fault tolerance).'
    },
    {
      id: 'spk-14',
      q: 'What causes Out of Memory (OOM) errors in Spark executors (Driver OOM vs Executor OOM)?',
      a: 'Driver OOM: calling df.collect() on massive datasets or broadcasting huge tables exceeding driver memory. Executor OOM: high memory pressure during shuffle, data skew causing one partition to exceed container memory, or excessive garbage collection. Mitigate by increasing executor memory, tuning partitions, and avoiding collect().'
    },
    {
      id: 'spk-15',
      q: 'What is Spark Structured Streaming and how does the micro-batch model work?',
      a: 'Structured Streaming is a stream processing engine built on the Spark SQL engine. It processes real-time data streams as an unbounded append-only table. In micro-batch mode, incoming streaming events are packaged into small periodic batches (e.g. every 500ms) and processed via the Catalyst query optimizer.'
    },
    {
      id: 'spk-16',
      q: 'What are Watermarks in Spark Structured Streaming and how do they handle late data?',
      a: 'A watermark specifies how long to wait for late-arriving events based on event-time timestamps: withWatermark("timestamp", "10 minutes"). Events arriving older than (max_event_time_seen - 10 minutes) are dropped, allowing Spark to purge old aggregate state from memory and prevent unbounded state growth.'
    },
    {
      id: 'spk-17',
      q: 'What is Delta Lake / Apache Iceberg / Apache Hudi (Lakehouse Table Formats)?',
      a: 'Open-source storage layers that bring ACID transactions to data lakes (Parquet files on S3/HDFS). Key features: 1) ACID transactions via transaction logs (_delta_log). 2) Time Travel (querying historical table snapshots). 3) Schema enforcement and schema evolution. 4) Unified batch and streaming processing.'
    },
    {
      id: 'spk-18',
      q: 'What is Predicate Pushdown in Spark and Parquet files?',
      a: 'Predicate pushdown moves filter operations (WHERE age > 30) directly down to the storage layer before reading data into Spark memory. Parquet file metadata contains min/max statistics for each column chunk; Spark reads these statistics to skip entire row groups that don\'t match the filter.'
    },
    {
      id: 'spk-19',
      q: 'What is Columnar Storage (Parquet, ORC) and why is it superior to Row-based formats (CSV, JSON)?',
      a: 'Row-based formats store data row-by-row, requiring scanning every column even if only two columns are queried. Columnar formats store data column-by-column, enabling: 1) Column projection (read only queried columns). 2) High compression ratios (similar data types compressed together). 3) Dictionary and run-length encoding.'
    },
    {
      id: 'spk-20',
      q: 'What is Broadcast Variable vs Accumulator in Spark?',
      a: 'A Broadcast Variable caches a read-only variable on every worker machine rather than shipping a copy with each task (sparkContext.broadcast(map)). An Accumulator is a shared write-only variable aggregated across workers using associative operations, commonly used for counters or debugging metrics.'
    },
    {
      id: 'spk-21',
      q: 'What are UDFs (User Defined Functions) and Vectorized / Pandas UDFs in PySpark?',
      a: 'Standard Python UDFs serialize data between JVM and Python row-by-row, causing severe serialization bottlenecks. Pandas UDFs (Vectorized UDFs) use Apache Arrow to transfer data between JVM and Python in columnar batches, utilizing SIMD vectorization and NumPy/Pandas for 10-100x faster execution.'
    },
    {
      id: 'spk-22',
      q: 'How does Spark achieve Fault Tolerance in RDDs and Streaming?',
      a: 'RDDs achieve fault tolerance through Lineage: if a partition is lost due to node failure, Spark recomputes only the lost partition using the recorded DAG lineage graph. Structured Streaming uses Write-Ahead Logs (WAL) and checkpoint directories to track offsets, guaranteeing exactly-once processing.'
    },
    {
      id: 'spk-23',
      q: 'What are Dynamic Allocation settings (spark.dynamicAllocation.enabled) in Spark?',
      a: 'Dynamic allocation dynamically scales the number of executors up and down based on workload. If tasks are pending in queue, Spark adds executors (minExecutors to maxExecutors). If executors remain idle for spark.dynamicAllocation.executorIdleTimeout (e.g. 60s), they are decommissioned.'
    },
    {
      id: 'spk-24',
      q: 'What is the DAG Scheduler vs Task Scheduler in Spark Driver?',
      a: 'The DAG Scheduler converts high-level RDD transformations into a topological DAG, splits the DAG into Stages at shuffle boundaries, and passes Stage TaskSets to the Task Scheduler. The Task Scheduler assigns individual tasks to worker executor cores based on data locality.'
    },
    {
      id: 'spk-25',
      q: 'What is Data Locality in Spark (PROCESS_LOCAL, NODE_LOCAL, RACK_LOCAL)?',
      a: 'Spark schedules tasks as close to data as possible: 1) PROCESS_LOCAL: data is in the same JVM executor process as task (fastest). 2) NODE_LOCAL: data is on the same physical host (e.g. in HDFS datanode or OS cache). 3) RACK_LOCAL: data is on another host on the same rack. 4) ANY: data is on different rack.'
    },
    {
      id: 'spk-26',
      q: 'How do you tune Spark Shuffle Partitions (spark.sql.shuffle.partitions)?',
      a: 'The default is 200 partitions. If processing 100GB of shuffle data, 200 partitions creates 500MB partitions (causing memory spills). Target partition sizes of 100MB-200MB. Calculate partitions = (Total Shuffle Data Size) / 128MB, or enable Adaptive Query Execution (AQE) to coalesce partitions dynamically.'
    },
    {
      id: 'spk-27',
      q: 'What is Spark Connect in Spark 3.4+?',
      a: 'Spark Connect decouples the client application from the Spark Driver using a thin, lightweight gRPC API. Data scientists can run PySpark or Spark SQL queries from lightweight laptops or IDEs without running a local JVM, connecting remotely to Spark clusters in the cloud.'
    },
    {
      id: 'spk-28',
      q: 'What is Z-Ordering in Delta Lake / Iceberg?',
      a: 'Z-Ordering (Z-Curve) is a multi-dimensional clustering technique that organizes data along multiple columns simultaneously. It maps multidimensional data to one dimension while preserving locality, maximizing the effectiveness of data skipping for queries filtering on any combination of those columns.'
    },
    {
      id: 'spk-29',
      q: 'How do you inspect and debug Spark queries using the Spark Web UI?',
      a: 'Key tabs: 1) Jobs: shows high-level job duration and failures. 2) Stages: displays task skew, shuffle read/write sizes, and Garbage Collection (GC) times. 3) SQL/DataFrame: shows visual execution DAG plan (SortMergeJoin, broadcast, filter pushdown). 4) Executors: shows CPU utilization and memory spills.'
    },
    {
      id: 'spk-30',
      q: 'What is Garbage Collection tuning for Spark executors (G1GC)?',
      a: 'Large executor heaps with default CMS GC suffer from long Stop-the-World pauses during shuffle. Use G1GC (-XX:+UseG1GC) with -XX:InitiatingHeapOccupancyPercent=35 and tune -XX:G1ReservePercent=15 to balance throughput and prevent pause-induced executor timeouts.'
    }
  ],

  // -------------------------------------------------------------
  // 9. KAFKA & REAL-TIME STREAMING (30 Questions)
  // -------------------------------------------------------------
  kafka_streaming: [
    {
      id: 'kfk-1',
      q: 'What is Apache Kafka Architecture (Topics, Partitions, Brokers, Producer, Consumer)?',
      a: 'Kafka is a distributed append-only commit log. A Topic is a logical stream of records. Topics are divided into Partitions for parallel processing and distributed across Brokers. Producers write events to partition logs; Consumers read from partitions in Consumer Groups. Each partition is an ordered, immutable sequence of messages.'
    },
    {
      id: 'kfk-2',
      q: 'How does Kafka achieve high-throughput and low-latency (Zero-Copy, Sequential I/O, Page Cache)?',
      a: '1) Sequential I/O: appends records to disk sequentially, matching sequential disk/SSD speeds. 2) Linux Page Cache: reads and writes hit RAM kernel page cache directly. 3) Zero-Copy (sendfile syscall): transfers data from page cache directly to network socket without copying data into user space JVM memory. 4) Batching & Compression.'
    },
    {
      id: 'kfk-3',
      q: 'How do Consumer Groups and Partition Rebalancing work in Kafka?',
      a: 'A Consumer Group distributes topic partitions among group consumers: each partition is consumed by exactly one consumer within the group. If a consumer crashes or joins, the Group Coordinator triggers Partition Rebalancing. Cooperative Sticky Assignor reassigns only displaced partitions without stopping all consumers.'
    },
    {
      id: 'kfk-4',
      q: 'What are Delivery Semantics in Kafka: At-most-once, At-least-once, and Exactly-once (EOS)?',
      a: 'At-most-once: offsets committed before processing; messages lost on consumer crash. At-least-once: offsets committed after processing; duplicate messages possible on failure. Exactly-once (EOS): uses idempotent producers (PID + sequence numbers) and transactional producer/consumer APIs across Kafka read-process-write loops.'
    },
    {
      id: 'kfk-5',
      q: 'What is the difference between Leader and Follower Replicas and what is ISR (In-Sync Replicas)?',
      a: 'Each partition has 1 Leader and N-1 Followers. All client reads and writes go to the Leader. Followers replicate records. ISR is the set of replicas that are fully caught up with the leader within replica.lag.time.max.ms. If the leader fails, only an ISR member is elected new leader.'
    },
    {
      id: 'kfk-6',
      q: 'What does acks=all (acks=-1) and min.insync.replicas mean in Kafka Producer?',
      a: 'acks=all requires the leader to wait until all replicas currently in the ISR acknowledge the write before responding to the producer. Combined with min.insync.replicas=2 (on replication factor 3), it guarantees durability: writes succeed only if at least 2 in-sync replicas confirm the write.'
    },
    {
      id: 'kfk-7',
      q: 'What is KRaft (Kafka Raft Metadata mode) and why did Kafka remove Apache ZooKeeper?',
      a: 'KRaft manages cluster metadata internally using an event-driven Raft consensus algorithm across quorum controller brokers. Removing ZooKeeper eliminates metadata synchronization latency, enables Kafka clusters to scale to millions of partitions, and simplifies operational maintenance.'
    },
    {
      id: 'kfk-8',
      q: 'What is Log Compaction in Kafka and how does it differ from Log Retention by Time/Size?',
      a: 'Standard retention deletes log segments after a time threshold (e.g. 7 days) or size limit. Log Compaction retains at least the last known value for each message key within a topic partition. Deleted keys are published with a null payload (tombstone) and purged during compaction cleaning.'
    },
    {
      id: 'kfk-9',
      q: 'What is Kafka Connect (Source Connectors vs Sink Connectors)?',
      a: 'Kafka Connect is a scalable framework for streaming data between Kafka and external systems. Source Connectors pull data from external datastores (PostgreSQL, MySQL via Debezium CDC) into Kafka topics. Sink Connectors export data from Kafka topics into downstream targets (Snowflake, Elasticsearch, S3).'
    },
    {
      id: 'kfk-10',
      q: 'What is Kafka Streams and how does KStream differ from KTable and GlobalKTable?',
      a: 'Kafka Streams is a client library for stream processing. KStream represents an unbounded stream of individual record changelogs (inserts). KTable represents the latest current state per key (like an aggregated table view / updates). GlobalKTable replicates an entire topic across all application instances for local lookups.'
    },
    {
      id: 'kfk-11',
      q: 'What is Schema Registry (Confluent Schema Registry) and Avro / Protobuf serialization?',
      a: 'Schema Registry stores and versions message schemas independently of data. Producers send only a 4-byte Schema ID in message headers; consumers fetch the schema from the registry to deserialize. It enforces schema compatibility (backward, forward, full) preventing breaking changes.'
    },
    {
      id: 'kfk-12',
      q: 'What is Consumer Lag and how do you monitor and resolve it?',
      a: 'Consumer lag is the difference between the latest offset produced in a partition (Log End Offset) and the current offset processed by the consumer group. High lag indicates the consumer cannot keep pace with production rate. Resolve by increasing partitions and adding consumer instances, or optimizing consumer processing logic.'
    },
    {
      id: 'kfk-13',
      q: 'What causes Message Duplication in Kafka and how do you achieve consumer idempotency?',
      a: 'Duplication occurs when a consumer processes a message and writes to DB, but crashes before committing the Kafka offset. On restart, it re-consumes the message. Achieve consumer idempotency by using database unique constraints, upserts, or checking a Redis processed_messages set before applying mutations.'
    },
    {
      id: 'kfk-14',
      q: 'What is a Poison Pill message in Kafka and how does Dead Letter Queue (DLQ) handle it?',
      a: 'A poison pill is a malformed or corrupt message that consistently fails deserialization or processing, crashing the consumer in an infinite retry loop. A Dead Letter Queue (DLQ) pattern catches unprocessable messages, publishes them to an error topic for auditing, and commits the offset to unblock the pipeline.'
    },
    {
      id: 'kfk-15',
      q: 'What are Partitioning Strategies in Kafka Producers (Default, Round-Robin, Key-Hash, Custom)?',
      a: 'If a message key is provided, Kafka hashes the key (MurmurHash2) modulo partition count, guaranteeing that all messages with the same key are routed to the identical partition in strict order. If key is null, Kafka uses the Sticky Partitioner to batch records into a partition until full before switching.'
    },
    {
      id: 'kfk-16',
      q: 'What is Exactly-Once Processing in Kafka Streams (processing.guarantee=exactly_once_v2)?',
      a: 'It combines transactional producers with atomic state store updates (RocksDB) and offset commits. Kafka writes state changes and offsets in a single atomic transaction; if any stage fails, all intermediate state mutations roll back seamlessly.'
    },
    {
      id: 'kfk-17',
      q: 'What is Backpressure in streaming systems and how does Kafka naturally handle it?',
      a: 'Backpressure occurs when downstream consumers process slower than upstream producers produce. Push-based systems overwhelm consumer buffers. Kafka is a pull-based (consumer poll) architecture: consumers pull data at their own pace, and unread messages safely buffer on broker disks.'
    },
    {
      id: 'kfk-18',
      q: 'What is Apache Flink and how does it compare to Spark Streaming and Kafka Streams?',
      a: 'Kafka Streams is a library embedded in microservices (no cluster needed). Spark Streaming uses micro-batching. Apache Flink is a true event-driven distributed stream processor that processes events one-by-one with sub-millisecond latency, advanced event-time windowing, and distributed state checkpoints (Chandy-Lamport).'
    },
    {
      id: 'kfk-19',
      q: 'What is the Outbox Pattern with Kafka and Change Data Capture (CDC / Debezium)?',
      a: 'To prevent dual-write inconsistencies between a database and Kafka, the application updates business tables and inserts an event record into an outbox table within a single ACID transaction. Debezium reads the database transaction log (PostgreSQL WAL) and streams outbox events to Kafka reliably.'
    },
    {
      id: 'kfk-20',
      q: 'What is Message Ordering guarantee in Kafka and can ordering be maintained across multiple partitions?',
      a: 'Kafka guarantees total message ordering ONLY within a single partition, NOT across multiple partitions. To maintain ordering for related events, assign them the identical message key (e.g. orderId or userId). For global topic ordering, the topic must have exactly 1 partition.'
    },
    {
      id: 'kfk-21',
      q: 'What is Tiered Storage in Kafka (KIP-405)?',
      a: 'Tiered Storage decouples storage from compute in Kafka: hot, recent data is kept on fast local SSDs for low-latency consumer reads, while older historical log segments are automatically offloaded to low-cost cloud object storage (Amazon S3 / Google GCS), allowing infinite topic retention at low cost.'
    },
    {
      id: 'kfk-22',
      q: 'What is MirrorMaker 2 (MM2) for cross-datacenter Kafka replication?',
      a: 'MirrorMaker 2 uses the Kafka Connect framework to replicate topics, consumer group offsets, and topic configurations between active-active or active-passive Kafka clusters across different geographical regions for disaster recovery and regional data aggregation.'
    },
    {
      id: 'kfk-23',
      q: 'What is Windowing in streaming: Tumbling, Hopping, Sliding, and Session Windows?',
      a: 'Tumbling: fixed-size, non-overlapping time windows (e.g. every 5 min). Hopping: fixed-size, overlapping windows (5 min window hopping every 1 min). Sliding: window bounds update continuously with each event. Session: dynamic windows defined by periods of inactivity between events.'
    },
    {
      id: 'kfk-24',
      q: 'What are RocksDB State Stores in Kafka Streams?',
      a: 'Kafka Streams uses embedded RocksDB (an in-memory and disk-backed LSM-tree key-value store) on local worker disks to maintain stateful aggregates (KTable, window aggregations) without querying remote databases, backing up changes to changelog Kafka topics.'
    },
    {
      id: 'kfk-25',
      q: 'What is max.poll.interval.ms vs session.timeout.ms in Kafka Consumers?',
      a: 'session.timeout.ms: heartbeat timeout; if broker receives no heartbeat within this time, the consumer is considered dead. max.poll.interval.ms: maximum allowed time between poll() calls; if business processing of a batch exceeds this limit, the consumer is evicted from the group.'
    },
    {
      id: 'kfk-26',
      q: 'What is Idempotent Producer in Kafka (enable.idempotence=true)?',
      a: 'An idempotent producer guarantees that network retries due to broker timeouts do not result in duplicate messages in the log. The broker assigns a Producer ID (PID) and tracks monotonic Sequence Numbers per partition, discarding duplicate sequence numbers.'
    },
    {
      id: 'kfk-27',
      q: 'What is ksqlDB and how does it allow stream processing using SQL syntax?',
      a: 'ksqlDB is an event streaming database built on Kafka Streams that allows engineers to build stream processing applications using declarative SQL syntax (CREATE STREAM, CREATE TABLE AS SELECT, JOIN), abstracting low-level Java API code.'
    },
    {
      id: 'kfk-28',
      q: 'What is Under-Replicated Partitions and what does it indicate?',
      a: 'An under-replicated partition is a partition where the number of in-sync replicas (ISR) is less than the configured replication factor. It indicates that one or more follower brokers are dead, experiencing network partitions, or lagging behind disk I/O.'
    },
    {
      id: 'kfk-29',
      q: 'What are Security Protocols in Kafka (SSL/TLS, SASL_PLAINTEXT, SASL_SSL, ACLs)?',
      a: 'Kafka secures data with: 1) SSL/TLS encryption for wire transfer. 2) SASL authentication (SASL/SCRAM, SASL/OAUTHBEARER, SASL/GSSAPI Kerberos) to authenticate clients. 3) Access Control Lists (ACLs) to enforce granular read/write permissions on topics and consumer groups.'
    },
    {
      id: 'kfk-30',
      q: 'What is Event Sourcing with Kafka as the event backbone?',
      a: 'In Event Sourcing, every state change is stored as an immutable event in Kafka. The current state is a projection derived by replaying events from offset 0. Kafka acts as the immutable system of record, enabling auditability, temporal querying, and independent read projections.'
    }
  ],

  // -------------------------------------------------------------
  // 10. DATA WAREHOUSING & ETL (30 Questions)
  // -------------------------------------------------------------
  data_warehousing: [
    {
      id: 'dwh-1',
      q: 'What is Snowflake Architecture (Database Storage, Query Processing, Cloud Services)?',
      a: 'Snowflake separates storage from compute: 1) Centralized Database Storage: compressed, columnar micro-partitions stored in cloud object storage (S3/GCS/Azure Blob). 2) Multi-Cluster Compute (Virtual Warehouses): independent compute clusters that execute queries on shared storage without resource contention. 3) Cloud Services layer: handles authentication, metadata, query optimization, and transaction management.'
    },
    {
      id: 'dwh-2',
      q: 'What is Google BigQuery Architecture (Dremel, Colossus, Jupiter network, Borg)?',
      a: 'BigQuery is a serverless, multi-cloud data warehouse: 1) Dremel: execution engine that converts SQL into execution trees and schedules queries dynamically across thousands of worker slots. 2) Colossus: Google\'s distributed file system storing data in Capacitor columnar format. 3) Jupiter: petabit bisection bandwidth network. 4) Borg: cluster orchestrator.'
    },
    {
      id: 'dwh-3',
      q: 'What is dbt (data build tool) and how does it implement ELT (Extract, Load, Transform)?',
      a: 'In traditional ETL, data is transformed before loading into the warehouse. In ELT, raw data is extracted and loaded directly into the data warehouse first. dbt enables analytics engineers to write modular SQL SELECT statements and Jinja templates that dbt compiles into executable DDL/DML models, executing transformations directly inside the warehouse.'
    },
    {
      id: 'dwh-4',
      q: 'What is the difference between OLTP (Online Transaction Processing) and OLAP (Online Analytical Processing)?',
      a: 'OLTP (PostgreSQL, MySQL) is designed for high concurrency, fast row-based CRUD operations, normalized schemas (3NF), and ACID transactions for operational apps. OLAP (Snowflake, BigQuery, ClickHouse) is designed for complex analytical aggregations (SUM, AVG) over billions of rows, using denormalized schemas and columnar storage.'
    },
    {
      id: 'dwh-5',
      q: 'What is Dimensional Modeling: Star Schema vs Snowflake Schema?',
      a: 'Star Schema consists of a central Fact Table (measurements, metrics) surrounded by denormalized Dimension Tables (context: customer, date, store), optimizing query performance with simple joins. Snowflake Schema normalizes dimension tables into hierarchies (e.g. splitting store into city and country tables), saving storage space but requiring complex multi-table joins.'
    },
    {
      id: 'dwh-6',
      q: 'What is a Fact Table vs Dimension Table?',
      a: 'Fact Tables contain quantitative numerical measurements and foreign keys referencing dimensions (e.g. sales_amount, quantity, timestamp_id). Dimension Tables contain qualitative descriptive context used to filter, group, and slice facts (e.g. customer_name, product_category, store_location).'
    },
    {
      id: 'dwh-7',
      q: 'What are Slowly Changing Dimensions (SCD Type 1, Type 2, Type 3)?',
      a: 'SCD Type 1: overwrites existing values directly without saving history. SCD Type 2: preserves full historical context by inserting a new row with start_date, end_date, and is_current flag when an attribute changes. SCD Type 3: preserves limited history by adding a previous_value column to the existing row.'
    },
    {
      id: 'dwh-8',
      q: 'What are Snowflake Micro-partitions and Data Clustering?',
      a: 'Snowflake stores all data in contiguous 50MB-500MB micro-partitions automatically created on ingestion in columnar format. Snowflake maintains min/max metadata for every column in each micro-partition, allowing queries to prune non-matching micro-partitions automatically without manual indexing.'
    },
    {
      id: 'dwh-9',
      q: 'What is Partitioning and Clustering in Google BigQuery?',
      a: 'Partitioning divides a table into segments based on a date/timestamp column or integer range, pruning unqueried partitions to reduce query cost and byte scans. Clustering groups related data within each partition based on up to 4 columns, organizing data for fast co-located scanning and sorting.'
    },
    {
      id: 'dwh-10',
      q: 'What is Snowflake Time Travel and Fail-Safe?',
      a: 'Time Travel allows accessing historical data, querying past snapshots, and restoring dropped tables using AT / BEFORE timestamp clauses (retention: 0 to 90 days). Fail-Safe is a 7-day non-configurable disaster recovery window managed solely by Snowflake support to recover lost data after Time Travel expires.'
    },
    {
      id: 'dwh-11',
      q: 'What is Snowflake Zero-Copy Cloning?',
      a: 'Zero-Copy Cloning creates a new database, schema, or table instantly without copying underlying physical data blocks. The cloned object references the existing micro-partitions in metadata; storage costs accrue only when new or modified rows generate divergent micro-partitions.'
    },
    {
      id: 'dwh-12',
      q: 'What are Data Marts vs Data Warehouse vs Data Lake vs Data Lakehouse?',
      a: 'Data Lake: stores raw, unstructured/semi-structured data (S3/GCS). Data Warehouse: stores curated, structured data optimized for SQL queries. Data Mart: focused subset of warehouse data for a specific department (Finance, Marketing). Data Lakehouse (Delta Lake/Iceberg): combines the cost-efficiency of data lakes with the ACID transactions and performance of warehouses.'
    },
    {
      id: 'dwh-13',
      q: 'What is dbt Incremental Model and how does is_incremental() optimize runtime?',
      a: 'An incremental model transforms and inserts only new or modified records since the previous dbt run, avoiding expensive full-table rebuilds: {% if is_incremental() %} WHERE updated_at > (SELECT MAX(updated_at) FROM {{ this }}) {% endif %}.'
    },
    {
      id: 'dwh-14',
      q: 'What are dbt Tests (Generic tests: unique, not_null, accepted_values, relationships)?',
      a: 'dbt tests assert assumptions about data models. Generic schema tests defined in YAML (e.g. checking that user_id is unique and not_null, and order_status is in accepted_values) run automated validation queries in CI/CD, catching data quality regressions before production release.'
    },
    {
      id: 'dwh-15',
      q: 'What is Apache Airflow and how do DAGs, Operators, and Sensors work?',
      a: 'Apache Airflow is a workflow orchestrator. A DAG (Directed Acyclic Graph) defines workflow dependencies in Python. Operators define single tasks (e.g. PythonOperator, BashOperator, SnowflakeOperator). Sensors wait for external criteria to be satisfied (e.g. S3KeySensor waits for file upload) before proceeding.'
    },
    {
      id: 'dwh-16',
      q: 'What is Data Lineage and why is it essential in modern data platforms?',
      a: 'Data lineage maps the complete journey of data: from source systems, through ingestion pipelines, intermediate transformations (dbt DAGs), to final BI dashboards. It enables impact analysis (evaluating what reports break if a source schema changes) and compliance auditing (GDPR).'
    },
    {
      id: 'dwh-17',
      q: 'What is Medallion Architecture (Bronze, Silver, Gold layers)?',
      a: '1) Bronze layer (Raw): exact raw ingestion data directly from sources (append-only). 2) Silver layer (Cleansed/Enriched): filtered, deduplicated, standardized, and validated data with schema enforcement. 3) Gold layer (Curated Business): aggregated, business-level dimensional star schemas ready for BI and machine learning.'
    },
    {
      id: 'dwh-18',
      q: 'What is Change Data Capture (CDC) and how is it used in data lake ingestion?',
      a: 'CDC captures row-level INSERT, UPDATE, and DELETE changes from transactional databases (PostgreSQL/MySQL) via replication logs and streams them to data lakes. It replaces expensive batch SELECT * queries, providing real-time data sync with near-zero load on source databases.'
    },
    {
      id: 'dwh-19',
      q: 'What are BigQuery Slots and how does On-Demand pricing differ from Capacity / Editions pricing?',
      a: 'A slot is a virtual CPU used to execute SQL queries. On-Demand pricing charges based on bytes scanned by queries ($6.25 per TB scanned). Capacity / Editions pricing (Standard, Enterprise, Enterprise Plus) reserves dedicated slot capacity for predictable query workloads and cost control.'
    },
    {
      id: 'dwh-20',
      q: 'What is Snowflake Snowpipe and how does automated event-driven ingestion work?',
      a: 'Snowpipe loads data in micro-batches continuously as files land in cloud storage (S3). Cloud storage event notifications (S3 SNS/SQS) trigger Snowpipe to ingest files into target tables using serverless compute without requiring a running virtual warehouse.'
    },
    {
      id: 'dwh-21',
      q: 'What are Surrogate Keys vs Natural Keys in data warehouses?',
      a: 'A Natural Key is an identifier from source business data (e.g. social security number or email). A Surrogate Key is an artificially generated unique identifier (e.g. hash or auto-incrementing integer) assigned within the warehouse, insulating the dimensional model from source system key changes.'
    },
    {
      id: 'dwh-22',
      q: 'What is Data Mesh and how does it decentralize data ownership?',
      a: 'Data Mesh moves away from centralized monolithic data teams. It treats "Data as a Product", assigning end-to-end data ownership to domain teams (Checkout team owns checkout data models), supported by a federated governance model and a self-serve data platform infrastructure.'
    },
    {
      id: 'dwh-23',
      q: 'What is Reverse ETL (Census, Hightouch) and why is it used?',
      a: 'Standard ETL moves data from operational apps to the warehouse. Reverse ETL syncs transformed, enriched customer data from the data warehouse back into operational tools (Salesforce, HubSpot, Zendesk), empowering marketing and sales teams with fresh analytical insights.'
    },
    {
      id: 'dwh-24',
      q: 'What is Data Observability and Monte Carlo\'s 5 Pillars of Data Health?',
      a: 'The 5 pillars: 1) Freshness: is the data up to date? 2) Volume: did the expected row count land? 3) Schema: did column types or field names change? 4) Distribution: are numeric/categorical ranges within statistical bounds? 5) Lineage: where did upstream issues originate?'
    },
    {
      id: 'dwh-25',
      q: 'What are Conformed Dimensions in enterprise data warehouses?',
      a: 'A conformed dimension is a single, consistent dimension table (e.g. Dim_Customer or Dim_Date) shared across multiple distinct fact tables and business domains, ensuring consistent metrics and enabling cross-functional drill-down queries.'
    },
    {
      id: 'dwh-26',
      q: 'What is Column Pruning and Partition Pruning in SQL query optimization?',
      a: 'Partition pruning skips entire table partitions during query planning based on WHERE clauses. Column pruning reads only the specific projected columns in the SELECT clause, completely skipping unreferenced columns in columnar storage formats.'
    },
    {
      id: 'dwh-27',
      q: 'What are dbt Snapshots and how do they automate SCD Type 2 tracking?',
      a: 'dbt snapshots track historical changes in mutable source tables over time. By defining a unique key and an updated_at check strategy, dbt automatically generates and maintains valid_from and valid_to timestamps on record updates (automating SCD Type 2).'
    },
    {
      id: 'dwh-28',
      q: 'What is Data Quality testing using Great Expectations?',
      a: 'Great Expectations is an open-source Python data validation framework. It defines declarative expectations on datasets (e.g. expect_column_values_to_be_unique, expect_column_values_to_not_be_null) and generates visual data documentation reports automatically.'
    },
    {
      id: 'dwh-29',
      q: 'What are Materialized Views in modern data warehouses and how do they differ from standard Views?',
      a: 'A standard View is a saved SQL query executed dynamically on every call. A Materialized View pre-computes and persists query results on physical storage, automatically refreshing when underlying source tables mutate, delivering ultra-fast query execution for expensive aggregations.'
    },
    {
      id: 'dwh-30',
      q: 'How do you optimize cost in Snowflake and BigQuery?',
      a: 'Snowflake: auto-suspend warehouses after 60s of inactivity, auto-resume, rightsizing warehouse sizes (X-Small vs X-Large), and setting resource monitors. BigQuery: avoid SELECT *, partition and cluster tables, utilize query preview dry-runs, and store infrequently accessed tables in long-term storage.'
    }
  ]
};

module.exports = {
  newDomainsQuestions1
};
