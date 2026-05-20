// ─── ZONE B: CONSTANTS & STATIC DATA ────────────────────────────────────────

const MONTHS = {
  'enero':0,'febrero':1,'marzo':2,'abril':3,'mayo':4,'junio':5,
  'julio':6,'agosto':7,'septiembre':8,'octubre':9,'noviembre':10,'diciembre':11,
  'ene':0,'feb':1,'mar':2,'abr':3,'may':4,'jun':5,
  'jul':6,'ago':7,'sep':8,'oct':9,'nov':10,'dic':11
};

const PROFILE_MAP = {
  '1': 'Arquitecto/Diseñador',
  '2': 'Constructora/Contratista',
  '3': 'Vidriería/Fachadista'
};

const ELEMENT_MAP = {
  '1': 'Cancel de baño/Regadera',
  '2': 'Barandales/Balcones',
  '3': 'Ventanales/Fachadas'
};

const STEP_MESSAGES = {
  0: "Hola, ¿qué tal? Soy Ava y hoy tengo el placer de atender tu proyecto de vidrio templado.\n\nEscribe el número o la opción para darte la atención correcta:\n\n1️⃣ Comencemos con mi proyecto\n2️⃣ Solo quiero información general",
  1: "Para asignar los recursos correctos a tu propuesta, indica qué opción describe mejor tu actividad:\n\n1️⃣ Arquitecto o Diseñador\n2️⃣ Constructora o Contratista\n3️⃣ Vidriería o Fachadista\n4️⃣ Otro (describe)",
  2: "Queremos saber qué proyecto tienes en mente.\n\nSelecciona una opción y si no está, descríbelo brevemente:\n\n1️⃣ Cancel de baño o Regadera\n2️⃣ Barandales o Balcones\n3️⃣ Ventanales o Fachadas de vidrio / Proyectos de gran escala",
  3: "¿En qué estado se encuentra la obra o el lugar donde se va a instalar el vidrio?\n\n1️⃣ Ya está construido y listo para tomar medidas exactas\n2️⃣ Está en obra gris o construcción activa, pero ya tenemos las medidas planeadas\n3️⃣ Todavía no hay construcción física, solo tengo planos o ideas preliminares",
  4: "¿Cuál es tu situación actual para realizar la compra del material?\n\n1️⃣ Ya tengo el presupuesto listo y quiero elegir proveedor esta misma semana\n2️⃣ Estoy comparando opciones y precios para decidir este mes\n3️⃣ Solo estoy buscando cotizaciones para presupuestar un proyecto a futuro",
  5: "Para coordinar los tiempos de producción en nuestra planta, ¿cuándo necesitas el material en la obra?\n\n1️⃣ De inmediato (en menos de dos semanas)\n2️⃣ Planificado para las próximas semanas de este mes\n3️⃣ Sin fecha definida, depende de otros avances de la obra",
  6: "Perfecto. El siguiente paso es que te reúnas lo antes posible con uno de nuestros especialistas para definir los detalles técnicos de tu proyecto y proceder con la gestión.\n\nIndica tu preferencia:\n\n1️⃣ Reunión virtual por Google Meet\n2️⃣ Reunión presencial en nuestra Planta de Templado",
  7: "¿Qué fecha y hora te acomoda mejor?\n\nNuestro horario de atención es de lunes a viernes de 8 am a 5 pm.\n\nPor favor escríbela utilizando este formato de ejemplo:\n\n📌 29 de abril 10 am\n\nEscribe tu propuesta a continuación:",
  8: "Ya he apartado el espacio. ¿A nombre de quién agendo la cita y cómo nos encontraste?\n\nPor favor escribe ambos datos en un solo mensaje siguiendo este ejemplo:\n\n📌 Juan Pérez, por Google\n\nEscribe tu respuesta a continuación:",
  9: "Gracias por tu confianza, {first_name}. Mi trabajo ha terminado aquí. El mayor de los éxitos con tu proyecto.\n\nSi en el futuro necesitas gestionar tu cita, selecciona una opción:\n\n1️⃣ Iniciar la revisión de un nuevo proyecto\n2️⃣ Reagendar mi cita actual\n3️⃣ Cancelar mi cita",
  10: "Entendido, procedamos a reagendar tu espacio.\n\nIndica el formato que prefieres para esta nueva sesión:\n\n1️⃣ Reunión virtual por Google Meet\n2️⃣ Reunión presencial en nuestra Planta de Templado",
  11: "¿Qué nueva fecha y hora te acomodan mejor?\n\nRecuerda nuestro horario de lunes a viernes de 8 am a 5 pm.\n\nPor favor escríbela utilizando este formato de ejemplo:\n\n📌 15 de mayo 3 pm\n\nEscribe tu nueva propuesta a continuación:",
  12: "Para validar y actualizar el registro de la nueva cita en nuestro sistema:\n\nPor favor escribe tu nombre y apellido:",
  13: "Comprendo la situación. Para ayudarnos a mejorar nuestros procesos en la planta, indica el motivo principal de tu cancelación seleccionando una opción:\n\n1️⃣ Encontré un mejor proveedor\n2️⃣ El proceso es muy tardado\n3️⃣ Ya no puedo asistir",
  14: "Tu cita ha sido cancelada y los registros correspondientes han sido actualizados en nuestro sistema.\n\nSi deseas reactivar la atención o revisar un nuevo proyecto en el futuro:\n\nEscribe la palabra 'Inicio' o el número 1️⃣ en cualquier momento para comenzar de nuevo. Que tengas un excelente día."
};

const FORCE_REPLIES = {
  0:  "Para iniciar la atención de manera correcta, es necesario que selecciones una de las dos opciones disponibles ingresando el número o el texto correspondiente.",
  1:  "Por favor, indica tu perfil comercial seleccionando un número del 1️⃣ al 4️⃣ o escribiendo tu categoría correspondiente.",
  3:  "Para validar la viabilidad de la instalación, selecciona una de las 3 opciones numéricas o describe brevemente el estado actual de tu espacio.",
  4:  "Por favor, indícanos tu estatus comercial seleccionando una de las 3 opciones del menú para continuar.",
  5:  "Necesitamos conocer los tiempos de tu obra para programar la producción. Por favor, selecciona una opción válida del 1️⃣ al 3️⃣.",
  6:  "Por favor, define el formato de tu reunión ingresando 1️⃣ para sesión virtual o 2️⃣ para asistencia presencial en nuestra planta.",
  '7_format':   "El formato de fecha o el rango propuesto no es válido. Recuerda que nuestro horario es de lunes a viernes de 8 am a 5 pm, dentro de las próximas 4 semanas. Por favor intenta de nuevo siguiendo este ejemplo:\n\n📌 29 de abril 10 am",
  '7_conflict': "El espacio solicitado se encuentra ocupado. Te comparto 3 opciones disponibles cercanas:\n\n{SLOTS}\n\nPor favor, escribe tu opción preferida utilizando el formato del ejemplo.",
  8:  "Para finalizar la asignación del espacio, es indispensable que nos indiques tu nombre completo y el medio por el cual nos encontraste. Sigue el ejemplo:\n\n📌 Juan Pérez, por Google",
  9:  "Comando no reconocido. Para gestionar tu cita actual o iniciar un nuevo proyecto, por favor marca exclusivamente 1️⃣, 2️⃣ o 3️⃣.",
  10: "Por favor, define el formato de tu reunión ingresando 1️⃣ para sesión virtual o 2️⃣ para asistencia presencial en nuestra planta.",
  12: "Por favor, escribe el nombre y apellido registrado originalmente para validar tu identidad y actualizar el bloque del calendario.",
  13: "Tu opinión es muy importante para optimizar nuestra planta. Por favor selecciona el número del motivo de tu cancelación para concluir el proceso."
};

const DISQUALIFICATION_MESSAGE =
  "Gracias por tu interés en nuestros productos. Después de revisar los detalles de tu proyecto, " +
  "en este momento no contamos con las condiciones necesarias para proceder con una gestión formal en nuestra planta.\n\n" +
  "Te invitamos a comunicarte con nosotros nuevamente cuando tu proyecto cuente con construcción activa, " +
  "presupuesto definido y fechas establecidas. Estaremos encantados de atenderte.\n\n" +
  "Escribe la palabra 'Inicio' o el número 1️⃣ en cualquier momento para comenzar de nuevo. ¡Que tengas un excelente día!";

const INFO_GENERAL_MESSAGE =
  "Con gusto te brindamos información sobre nuestros productos de vidrio templado. " +
  "Fabricamos cancelería de baño, barandales, ventanales y fachadas de vidrio con " +
  "los más altos estándares de calidad y seguridad.\n\n" +
  "Si en el futuro deseas iniciar un proyecto formal, escribe la palabra 'Inicio' " +
  "o el número 1️⃣ en cualquier momento. ¡Que tengas un excelente día!";


// ─── ZONE A: UTILITY FUNCTIONS ───────────────────────────────────────────────

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function normalize(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

function parseSpanishDate(text, today) {
  var norm = normalize(text);

  // Extract day
  var dayMatch = norm.match(/\b(\d{1,2})\b/);
  if (!dayMatch) return { valid: false, reason: 'format' };
  var day = parseInt(dayMatch[1], 10);

  // Extract month (longest match wins)
  var foundMonth = -1;
  var monthKeys = Object.keys(MONTHS).sort(function(a,b){ return b.length - a.length; });
  for (var i = 0; i < monthKeys.length; i++) {
    if (norm.indexOf(monthKeys[i]) !== -1) {
      foundMonth = MONTHS[monthKeys[i]];
      break;
    }
  }
  if (foundMonth === -1) return { valid: false, reason: 'format' };

  // Extract hour (second number sequence, or first after month name)
  var allNums = norm.match(/\d+/g) || [];
  var hour = -1;
  for (var j = 0; j < allNums.length; j++) {
    var n = parseInt(allNums[j], 10);
    if (n >= 1 && n <= 24 && n !== day) {
      hour = n;
      break;
    }
  }
  if (hour === -1) {
    // Try any second number
    if (allNums.length >= 2) {
      hour = parseInt(allNums[1], 10);
    } else {
      return { valid: false, reason: 'format' };
    }
  }

  // AM/PM detection
  var hasPm = /\bpm\b/.test(norm);
  var hasAm = /\bam\b/.test(norm);

  if (hasPm && hour < 12) hour += 12;
  if (hasAm && hour === 12) hour = 0;
  if (!hasPm && !hasAm && hour < 8) hour += 12;

  // Build date (try current year, then next)
  var year = today.getFullYear();
  var candidate = new Date(year, foundMonth, day, hour, 0, 0, 0);
  if (candidate.getMonth() !== foundMonth) return { valid: false, reason: 'format' };

  var todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
  if (candidate < todayMidnight) {
    candidate = new Date(year + 1, foundMonth, day, hour, 0, 0, 0);
    if (candidate.getMonth() !== foundMonth) return { valid: false, reason: 'format' };
  }

  // Range: today to today+28 days
  var maxDate = new Date(todayMidnight.getTime() + 28 * 24 * 60 * 60 * 1000);
  maxDate.setHours(23, 59, 59, 999);

  var candidateMidnight = new Date(candidate.getFullYear(), candidate.getMonth(), candidate.getDate(), 0, 0, 0, 0);
  if (candidateMidnight < todayMidnight || candidateMidnight > maxDate) {
    return { valid: false, reason: 'range' };
  }

  // Weekday: Monday=1, Friday=5
  var dow = candidate.getDay();
  if (dow === 0 || dow === 6) return { valid: false, reason: 'weekend' };

  // Hours: 8 to 17
  if (hour < 8 || hour > 17) return { valid: false, reason: 'hours' };

  return { valid: true, dateObj: candidate, isoString: candidate.toISOString() };
}

function parseAttribution(text) {
  if (!text || !text.trim()) return null;
  var norm = normalize(text);
  var anchors = [',', ' desde ', ' por ', ' de '];
  var anchorPos = -1;
  var anchorLen = 0;

  for (var i = 0; i < anchors.length; i++) {
    var idx = norm.indexOf(anchors[i]);
    if (idx !== -1) {
      anchorPos = idx;
      anchorLen = anchors[i].length;
      break;
    }
  }

  var fullName, leadSource;
  if (anchorPos !== -1) {
    fullName   = text.slice(0, anchorPos).trim();
    leadSource = text.slice(anchorPos + anchorLen).trim();
  } else {
    fullName   = text.trim();
    leadSource = 'No especificado';
  }

  if (!fullName) return null;

  var firstName = fullName.split(/\s+/)[0];
  return { fullName: fullName, firstName: firstName, leadSource: leadSource || 'No especificado' };
}

function buildForceReply(state, msg) {
  return [{
    json: {
      chat_id:                    state.chat_id,
      lead_id:                    state.lead_id,
      project_id:                 state.project_id,
      meeting_id:                 state.meeting_id,
      brief_id:                   state.brief_id,
      current_step:               state.current_step,
      step3_score:                state.step3_score,
      step4_score:                state.step4_score,
      step5_score:                state.step5_score,
      first_name:                 state.first_name,
      full_name:                  state.full_name,
      profile:                    state.profile,
      profile_custom_desc:        state.profile_custom_desc,
      element:                    state.element,
      custom_project_description: state.custom_project_description,
      meeting_type:               state.meeting_type,
      proposed_datetime:          state.proposed_datetime,
      meeting_status:             state.meeting_status,
      conversation_status:        state.conversation_status,
      project_status:             state.project_status,
      lead_source:                state.lead_source,
      cancellation_reason:        state.cancellation_reason,
      calendar_conflict:          state.calendar_conflict,
      available_slots:            state.available_slots,
      update_calendar_event:      state.update_calendar_event  || false,
      delete_old_brief_email:     state.delete_old_brief_email || false,
      reply_text:                 msg,
      force_reply:                true
    }
  }];
}

function buildAdvance(state, nextStep, replyText) {
  return [{
    json: {
      chat_id:                    state.chat_id,
      lead_id:                    state.lead_id,
      project_id:                 state.project_id,
      meeting_id:                 state.meeting_id,
      brief_id:                   state.brief_id,
      current_step:               nextStep,
      step3_score:                state.step3_score,
      step4_score:                state.step4_score,
      step5_score:                state.step5_score,
      first_name:                 state.first_name,
      full_name:                  state.full_name,
      profile:                    state.profile,
      profile_custom_desc:        state.profile_custom_desc,
      element:                    state.element,
      custom_project_description: state.custom_project_description,
      meeting_type:               state.meeting_type,
      proposed_datetime:          state.proposed_datetime,
      meeting_status:             state.meeting_status,
      conversation_status:        state.conversation_status,
      project_status:             state.project_status,
      lead_source:                state.lead_source,
      cancellation_reason:        state.cancellation_reason,
      calendar_conflict:          state.calendar_conflict,
      available_slots:            state.available_slots,
      update_calendar_event:      state.update_calendar_event  || false,
      delete_old_brief_email:     state.delete_old_brief_email || false,
      reply_text:                 replyText,
      force_reply:                false
    }
  }];
}


// ─── ZONE C: STEP HANDLERS ───────────────────────────────────────────────────

function handleStep0(state) {
  var isNew = !state.lead_id || state.lead_id === '';
  if (isNew) {
    state.lead_id             = String(state.chat_id);
    state.project_id          = generateUUID();
    state.meeting_id          = generateUUID();
    state.conversation_status = 'Active';
    return buildAdvance(state, 0, STEP_MESSAGES[0]);
  }

  var t = normalize(state.inbound_text);
  var opt1 = t === '1' || t.indexOf('comencemos') !== -1 || t.indexOf('proyecto') !== -1;
  var opt2 = t === '2' || t.indexOf('informacion') !== -1 || t.indexOf('general') !== -1;

  if (opt1) {
    return buildAdvance(state, 1, STEP_MESSAGES[1]);
  }
  if (opt2) {
    state.conversation_status = 'Completed';
    return buildAdvance(state, 0, INFO_GENERAL_MESSAGE);
  }
  return buildForceReply(state, FORCE_REPLIES[0]);
}

function handleStep1(state) {
  var t  = normalize(state.inbound_text);
  var raw = state.inbound_text.trim();

  var profileKeywords = {
    '1': ['arquitecto','disenador','diseñador'],
    '2': ['constructora','contratista'],
    '3': ['vidrieria','vidriería','fachadista'],
    '4': ['otro']
  };

  var matched = null;
  if (t === '1' || t === '2' || t === '3' || t === '4') {
    matched = t;
  } else {
    var keys = Object.keys(profileKeywords);
    for (var i = 0; i < keys.length; i++) {
      var kws = profileKeywords[keys[i]];
      for (var j = 0; j < kws.length; j++) {
        if (t.indexOf(kws[j]) !== -1) { matched = keys[i]; break; }
      }
      if (matched) break;
    }
  }

  if (!matched) return buildForceReply(state, FORCE_REPLIES[1]);

  if (matched === '4') {
    state.profile             = 'Otro';
    state.profile_custom_desc = raw;
  } else {
    state.profile             = PROFILE_MAP[matched];
    state.profile_custom_desc = null;
  }
  return buildAdvance(state, 2, STEP_MESSAGES[2]);
}

function handleStep2(state) {
  var t   = normalize(state.inbound_text);
  var raw = state.inbound_text.trim();

  if (!raw) return buildForceReply(state, "Por favor, describe brevemente el proyecto que tienes en mente o selecciona una de las opciones del menú.");

  var elementKeywords = {
    '1': ['cancel','bano','baño','regadera','ducha'],
    '2': ['barandal','balcon','balcón','escalera'],
    '3': ['ventanal','fachada','vidrio','gran escala','proyecto grande']
  };

  var matched = null;
  if (t === '1' || t === '2' || t === '3') {
    matched = t;
  } else {
    var keys = Object.keys(elementKeywords);
    for (var i = 0; i < keys.length; i++) {
      var kws = elementKeywords[keys[i]];
      for (var j = 0; j < kws.length; j++) {
        if (t.indexOf(kws[j]) !== -1) { matched = keys[i]; break; }
      }
      if (matched) break;
    }
  }

  if (matched) {
    state.element                    = ELEMENT_MAP[matched];
    state.custom_project_description = null;
  } else {
    state.element                    = 'Personalizado';
    state.custom_project_description = raw;
  }
  return buildAdvance(state, 3, STEP_MESSAGES[3]);
}

function handleStep3(state) {
  var t = normalize(state.inbound_text);
  var score = 0;

  if (t === '1' || t.indexOf('construido') !== -1 || t.indexOf('exactas') !== -1) {
    score = 1;
  } else if (t === '2' || t.indexOf('obra gris') !== -1 || t.indexOf('activa') !== -1 || t.indexOf('planeadas') !== -1) {
    score = 2;
  } else if (t === '3' || t.indexOf('no hay') !== -1 || t.indexOf('planos') !== -1 || t.indexOf('preliminares') !== -1) {
    score = 3;
  }

  if (!score) return buildForceReply(state, FORCE_REPLIES[3]);

  state.step3_score = score;
  return buildAdvance(state, 4, STEP_MESSAGES[4]);
}

function handleStep4(state) {
  var t = normalize(state.inbound_text);
  var score = 0;

  if (t === '1' || t.indexOf('presupuesto') !== -1 || t.indexOf('proveedor') !== -1 || t.indexOf('semana') !== -1) {
    score = 1;
  } else if (t === '2' || t.indexOf('comparando') !== -1 || t.indexOf('opciones') !== -1 || t.indexOf('mes') !== -1) {
    score = 2;
  } else if (t === '3' || t.indexOf('cotizaciones') !== -1 || t.indexOf('futuro') !== -1 || t.indexOf('presupuestar') !== -1) {
    score = 3;
  }

  if (!score) return buildForceReply(state, FORCE_REPLIES[4]);

  state.step4_score = score;
  return buildAdvance(state, 5, STEP_MESSAGES[5]);
}

function handleStep5(state) {
  var t = normalize(state.inbound_text);
  var score = 0;

  if (t === '1' || t.indexOf('inmediato') !== -1 || t.indexOf('dos semanas') !== -1) {
    score = 1;
  } else if (t === '2' || t.indexOf('planificado') !== -1 || t.indexOf('proximas') !== -1 || t.indexOf('próximas') !== -1) {
    score = 2;
  } else if (t === '3' || t.indexOf('sin fecha') !== -1 || t.indexOf('definida') !== -1 || t.indexOf('avances') !== -1) {
    score = 3;
  }

  if (!score) return buildForceReply(state, FORCE_REPLIES[5]);

  state.step5_score = score;

  var s3 = parseInt(state.step3_score, 10);
  var s4 = parseInt(state.step4_score, 10);
  var s5 = score;

  if (s3 === 3 && s4 === 3 && s5 === 3) {
    state.project_status      = 'Unqualified';
    state.conversation_status = 'Completed';
    return buildAdvance(state, 5, DISQUALIFICATION_MESSAGE);
  }

  state.project_status = 'Qualified';
  return buildAdvance(state, 6, STEP_MESSAGES[6]);
}

function handleStep6(state) {
  var t = normalize(state.inbound_text);
  var matched = null;

  if (t === '1' || t.indexOf('virtual') !== -1 || t.indexOf('meet') !== -1) {
    matched = 'Virtual';
  } else if (t === '2' || t.indexOf('presencial') !== -1 || t.indexOf('planta') !== -1) {
    matched = 'Presencial';
  }

  if (!matched) return buildForceReply(state, FORCE_REPLIES[6]);

  state.meeting_type = matched;
  return buildAdvance(state, 7, STEP_MESSAGES[7]);
}

function handleStep7(state) {
  var today  = new Date();
  var parsed = parseSpanishDate(state.inbound_text, today);

  if (!parsed.valid) {
    return buildForceReply(state, FORCE_REPLIES['7_format']);
  }

  if (state.calendar_conflict === true || state.calendar_conflict === 'true') {
    var slots   = (state.available_slots || []).slice(0, 3);
    var slotStr = slots.map(function(s, i) { return (i+1) + '️⃣ ' + s; }).join('\n');
    var msg     = FORCE_REPLIES['7_conflict'].replace('{SLOTS}', slotStr);
    return buildForceReply(state, msg);
  }

  state.proposed_datetime = parsed.isoString;
  return buildAdvance(state, 8, STEP_MESSAGES[8]);
}

function handleStep8(state) {
  var raw    = state.inbound_text.trim();
  var parsed = parseAttribution(raw);

  if (!parsed) return buildForceReply(state, FORCE_REPLIES[8]);

  state.full_name           = parsed.fullName;
  state.first_name          = parsed.firstName;
  state.lead_source         = parsed.leadSource;
  state.brief_id            = generateUUID();
  state.conversation_status = 'Completed';
  state.meeting_status      = 'Scheduled';

  var msg = STEP_MESSAGES[9].replace('{first_name}', state.first_name || 'cliente');
  return buildAdvance(state, 9, msg);
}

function handleStep9(state) {
  var t = normalize(state.inbound_text);

  if (t === '1' || t.indexOf('nuevo proyecto') !== -1) {
    state.current_step        = 0;
    state.conversation_status = 'Active';
    state.project_id          = generateUUID();
    state.meeting_id          = generateUUID();
    state.project_status      = null;
    state.brief_id            = null;
    state.meeting_type        = null;
    state.step3_score         = null;
    state.step4_score         = null;
    state.step5_score         = null;
    state.proposed_datetime   = null;
    state.cancellation_reason = null;
    state.update_calendar_event  = false;
    state.delete_old_brief_email = false;
    return buildAdvance(state, 0, STEP_MESSAGES[0]);
  }

  if (t === '2' || t.indexOf('reagendar') !== -1) {
    return buildAdvance(state, 10, STEP_MESSAGES[10]);
  }

  if (t === '3' || t.indexOf('cancelar') !== -1) {
    return buildAdvance(state, 13, STEP_MESSAGES[13]);
  }

  return buildForceReply(state, FORCE_REPLIES[9]);
}

function handleStep10(state) {
  var t = normalize(state.inbound_text);
  var matched = null;

  if (t === '1' || t.indexOf('virtual') !== -1 || t.indexOf('meet') !== -1) {
    matched = 'Virtual';
  } else if (t === '2' || t.indexOf('presencial') !== -1 || t.indexOf('planta') !== -1) {
    matched = 'Presencial';
  }

  if (!matched) return buildForceReply(state, FORCE_REPLIES[10]);

  state.meeting_type = matched;
  return buildAdvance(state, 11, STEP_MESSAGES[11]);
}

function handleStep11(state) {
  var today  = new Date();
  var parsed = parseSpanishDate(state.inbound_text, today);

  if (!parsed.valid) {
    return buildForceReply(state, FORCE_REPLIES['7_format']);
  }

  if (state.calendar_conflict === true || state.calendar_conflict === 'true') {
    var slots   = (state.available_slots || []).slice(0, 3);
    var slotStr = slots.map(function(s, i) { return (i+1) + '️⃣ ' + s; }).join('\n');
    var msg     = FORCE_REPLIES['7_conflict'].replace('{SLOTS}', slotStr);
    return buildForceReply(state, msg);
  }

  state.proposed_datetime = parsed.isoString;
  return buildAdvance(state, 12, STEP_MESSAGES[12]);
}

function handleStep12(state) {
  var raw = state.inbound_text.trim();
  if (!raw) return buildForceReply(state, FORCE_REPLIES[12]);

  state.brief_id               = generateUUID();
  state.update_calendar_event  = true;
  state.delete_old_brief_email = true;
  state.meeting_status         = 'Rescheduled';

  var msg = STEP_MESSAGES[9].replace('{first_name}', state.first_name || 'cliente');
  return buildAdvance(state, 9, msg);
}

function handleStep13(state) {
  var t   = normalize(state.inbound_text);
  var raw = state.inbound_text.trim();
  var matched = null;

  if (t === '1' || t.indexOf('proveedor') !== -1 || t.indexOf('mejor') !== -1) {
    matched = 'Encontré un mejor proveedor';
  } else if (t === '2' || t.indexOf('tardado') !== -1 || t.indexOf('proceso') !== -1) {
    matched = 'El proceso es muy tardado';
  } else if (t === '3' || t.indexOf('asistir') !== -1 || t.indexOf('no puedo') !== -1) {
    matched = 'Ya no puedo asistir';
  }

  if (!matched) return buildForceReply(state, FORCE_REPLIES[13]);

  state.cancellation_reason = matched;
  return buildAdvance(state, 14, STEP_MESSAGES[14]);
}

function handleStep14(state) {
  state.meeting_status      = 'Cancelled';
  state.project_status      = 'Cancelled';
  state.conversation_status = 'Cancelled';
  return buildAdvance(state, 14, STEP_MESSAGES[14]);
}


// ─── ZONE D: ORCHESTRATOR / ROUTER ───────────────────────────────────────────

function route(state) {
  state.inbound_text = (state.inbound_text || '').toString().trim();
  state.current_step = parseInt(state.current_step, 10) || 0;

  // New user: lead_id absent → initialize and return welcome
  if (!state.lead_id || state.lead_id === '' || state.lead_id === 'null') {
    state.lead_id             = String(state.chat_id);
    state.project_id          = generateUUID();
    state.meeting_id          = generateUUID();
    state.conversation_status = 'Active';
    state.current_step        = 0;
    return buildAdvance(state, 0, STEP_MESSAGES[0]);
  }

  // Post-flow re-entry: "Inicio" or "1" restarts cleanly
  var postFlow = state.conversation_status === 'Completed' ||
                 state.conversation_status === 'Cancelled';
  var restartTrigger = normalize(state.inbound_text) === 'inicio' ||
                       state.inbound_text === '1';

  if (postFlow && restartTrigger) {
    state.current_step           = 0;
    state.conversation_status    = 'Active';
    state.project_id             = generateUUID();
    state.meeting_id             = generateUUID();
    state.project_status         = null;
    state.brief_id               = null;
    state.meeting_type           = null;
    state.step3_score            = null;
    state.step4_score            = null;
    state.step5_score            = null;
    state.proposed_datetime      = null;
    state.cancellation_reason    = null;
    state.update_calendar_event  = false;
    state.delete_old_brief_email = false;
    return buildAdvance(state, 0, STEP_MESSAGES[0]);
  }

  // Post-flow but no restart trigger → re-show farewell nudge
  if (postFlow) {
    var nudge = "Para reactivar la atención o iniciar un nuevo proyecto, " +
                "escribe la palabra 'Inicio' o el número 1️⃣ en cualquier momento.";
    return buildForceReply(state, nudge);
  }

  switch (state.current_step) {
    case 0:  return handleStep0(state);
    case 1:  return handleStep1(state);
    case 2:  return handleStep2(state);
    case 3:  return handleStep3(state);
    case 4:  return handleStep4(state);
    case 5:  return handleStep5(state);
    case 6:  return handleStep6(state);
    case 7:  return handleStep7(state);
    case 8:  return handleStep8(state);
    case 9:  return handleStep9(state);
    case 10: return handleStep10(state);
    case 11: return handleStep11(state);
    case 12: return handleStep12(state);
    case 13: return handleStep13(state);
    case 14: return handleStep14(state);
    default:
      state.current_step = 0;
      state.project_id   = generateUUID();
      state.meeting_id   = generateUUID();
      return buildAdvance(state, 0, STEP_MESSAGES[0]);
  }
}


// ─── ZONE E: n8n ENTRY POINT ─────────────────────────────────────────────────

var item  = $input.first();
var state = Object.assign({}, item.json);
return route(state);
